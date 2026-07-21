import SwiftUI

struct OnboardingView: View {
    @Environment(AppModel.self) private var app
    private var o: OnboardingModel { app.onboarding }

    var body: some View {
        ZStack {
            Palette.canvas.ignoresSafeArea()
            // Soft orange radial glow at the top.
            RadialGradient(colors: [Palette.accent.opacity(0.16), .clear],
                           center: .top, startRadius: 0, endRadius: 480)
                .ignoresSafeArea()

            VStack(spacing: 40) {
                Spacer()
                stepContent
                    .frame(maxWidth: 560)
                Spacer()
                stepDots
                    .padding(.bottom, 40)
            }
            .padding(40)
        }
        .transition(.opacity)
    }

    @ViewBuilder private var stepContent: some View {
        switch o.step {
        case .language: language
        case .welcome:  welcome
        case .download: download
        case .mic:      mic
        case .ready:    ready
        }
    }

    // 0. Interface language
    //
    // First thing asked, because it changes every screen after it. It sets the UI
    // only: the copy says so plainly, since the next thing the user will do is
    // create a voice and pick a language there too.
    private var language: some View {
        VStack(spacing: 20) {
            Image(systemName: "globe")
                .font(.system(size: 22, weight: .regular)).foregroundStyle(Palette.mute)
                .frame(width: 56, height: 56)
                .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.surface))
                .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous)
                    .strokeBorder(Palette.hairline, lineWidth: 1))

            Text(app.s["obLangTitle"]).font(.ui(26, .semibold)).foregroundStyle(Palette.ink)
            Text(app.s["obLangBody"])
                .font(.ui(14)).foregroundStyle(Palette.mute)
                .multilineTextAlignment(.center).lineSpacing(5)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxWidth: 460)

            HStack(spacing: 16) {
                ForEach(InterfaceLanguage.allCases) { l in
                    LanguageOptionCard(title: l.nativeName, note: nil,
                                       selected: app.interfaceLanguage == l) {
                        app.interfaceLanguage = l
                    }
                }
            }
            .frame(maxWidth: 360)

            Text(app.s["obLangHint"]).font(.mono(11.5)).foregroundStyle(Palette.ash)
                .multilineTextAlignment(.center)

            PrimaryButton(title: app.s["continue"]) { app.onboarding.step = .welcome }
                .padding(.top, 4)
        }
        .frame(maxWidth: 520)
    }

    // 1. Welcome
    private var welcome: some View {
        VStack(spacing: 20) {
            LogoMark(size: 60)
            Text(app.s["obWelcomeTitle"]).font(.ui(30, .semibold)).foregroundStyle(Palette.ink)
            Text(app.s["obWelcomeBody"])
                .font(.ui(15)).foregroundStyle(Palette.mute)
                .multilineTextAlignment(.center).lineSpacing(4)
            HStack(spacing: 10) {
                pill(app.s["obPillLocal"])
                pill(app.s["obPillNoUpload"])
                pill(app.s["obPillOffline"])
            }
            .padding(.top, 4)
            PrimaryButton(title: app.s["obGetStarted"]) {
                withAnimation(Motion.calm) { o.step = .download }
            }
            .padding(.top, 8)
        }
    }

    // 2. Model download (real)
    private var download: some View {
        let s = app.modelStatus
        return VStack(spacing: 24) {
            Text((s?.ready == true) ? "Voice models ready" : "Download the voice models")
                .font(.ui(30, .semibold)).foregroundStyle(Palette.ink)
                .multilineTextAlignment(.center)

            if !app.engineReady {
                HStack(spacing: 10) {
                    ProgressView().controlSize(.small).tint(Palette.accent)
                    Text(app.s["obPreparingEngine"]).font(.ui(14)).foregroundStyle(Palette.mute)
                }
                .frame(maxWidth: 440)
            } else if let s, s.ready {
                readyCard(s)
            } else if let s, s.downloading {
                progressCard(s)
            } else {
                tierChooser
            }

            PrimaryButton(title: app.s["continue"], enabled: s?.ready == true) {
                withAnimation(Motion.calm) { o.step = .mic }
            }
        }
        .task(id: app.engineReady) { if app.engineReady { await app.refreshModelStatus() } }
    }

    private var tierChooser: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                tierCard("balanced", app.s["obTierBalanced"], app.s["obTierBalancedBody"], "3.4 GB")
                tierCard("advanced", app.s["obTierHighQ"], app.s["obTierHighQBody"], "6.3 GB")
            }
            PrimaryButton(title: app.s["obDownloadModels"]) { app.downloadModels(tier: o.tier) }
            Text(app.s["obDownloadNote"])
                .font(.ui(12.5)).foregroundStyle(Palette.ash)
                .multilineTextAlignment(.center).frame(maxWidth: 440)
        }
    }

    private func tierCard(_ id: String, _ title: String, _ desc: String, _ size: String) -> some View {
        let sel = o.tier == id
        return Button { o.tier = id } label: {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(title).font(.ui(15, .semibold)).foregroundStyle(Palette.ink)
                    Spacer()
                    if sel { Image(systemName: "checkmark.circle.fill").font(.system(size: 15)).foregroundStyle(Palette.accent) }
                }
                Text(desc).font(.ui(12.5)).foregroundStyle(Palette.mute).fixedSize(horizontal: false, vertical: true)
                Text(size).font(.mono(12)).foregroundStyle(Palette.ash)
            }
            .padding(Space.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: Radius.card, style: .continuous)
                .fill(sel ? Palette.accent.opacity(0.06) : Palette.surface))
            .hairline(Radius.card, color: sel ? Palette.accent : Palette.hairline)
            .fullClickArea()
        }.buttonStyle(.plain)
    }

    private func progressCard(_ s: ModelStatus) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text(modelLabel(s.current)).font(.ui(15, .medium)).foregroundStyle(Palette.ink)
                Spacer()
                Text(String(format: "%.1f / %.1f GB", s.downloadedGB, s.totalGB))
                    .font(.mono(12)).foregroundStyle(Palette.mute)
            }
            ThinProgress(value: s.fraction, height: 8, gradient: true)
            HStack {
                Text("\(Int(s.fraction * 100))%").font(.mono(12)).foregroundStyle(Palette.mute)
                Spacer()
                Text(app.s["obDownloading"]).font(.mono(12)).foregroundStyle(Palette.mute)
            }
        }
        .padding(Space.xl).frame(maxWidth: 440)
        .card(Palette.surface, radius: Radius.card)
    }

    private func readyCard(_ s: ModelStatus) -> some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill").font(.system(size: 20)).foregroundStyle(Palette.good)
            VStack(alignment: .leading, spacing: 3) {
                Text(app.s["obModelsReady"]).font(.ui(15, .medium)).foregroundStyle(Palette.ink)
                Text(String(format: "%.1f GB on this Mac", s.totalGB)).font(.mono(12)).foregroundStyle(Palette.mute)
            }
            Spacer()
        }
        .padding(Space.lg).frame(maxWidth: 440)
        .card(Palette.surface, radius: Radius.card)
    }

    private func modelLabel(_ key: String?) -> String {
        switch key {
        case "tts_fast": return "Voice model (fast)"
        case "tts_best": return "Voice model (high quality)"
        case "whisper": return "Transcription model"
        default: return "Voice models"
        }
    }

    // 3. Microphone access
    private var mic: some View {
        VStack(spacing: 20) {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Palette.surfaceElevated).frame(width: 60, height: 60)
                .hairline(16, color: Palette.hairline)
                .overlay(Image(systemName: "mic").font(.system(size: 26)).foregroundStyle(Palette.mute))
            Text(app.s["obMicTitle"]).font(.ui(30, .semibold)).foregroundStyle(Palette.ink)
            Text(app.s["obMicBody"])
                .font(.ui(15)).foregroundStyle(Palette.mute)
                .multilineTextAlignment(.center).lineSpacing(4)
            HStack(spacing: 12) {
                SecondaryButton(title: app.s["obMicNotNow"]) { withAnimation(Motion.calm) { o.step = .ready } }
                PrimaryButton(title: app.s["obMicAllow"]) {
                    app.requestMic()
                    withAnimation(Motion.calm) { o.step = .ready }
                }
            }
            .padding(.top, 4)
        }
    }

    // 4. Ready
    private var ready: some View {
        VStack(spacing: 20) {
            Circle().fill(Palette.good.opacity(0.14)).frame(width: 72, height: 72)
                .overlay(Image(systemName: "checkmark").font(.system(size: 28, weight: .semibold)).foregroundStyle(Palette.good))
            Text(app.s["obReadyTitle"]).font(.ui(30, .semibold)).foregroundStyle(Palette.ink)
            Text(app.s["obReadyBody"])
                .font(.ui(15)).foregroundStyle(Palette.mute)
                .multilineTextAlignment(.center).lineSpacing(4)
            HStack(spacing: 12) {
                SecondaryButton(title: app.s["obReadyExplore"]) {
                    withAnimation(Motion.calm) { app.finishOnboarding(createVoice: false) }
                }
                PrimaryButton(title: app.s["obReadyCreate"]) {
                    withAnimation(Motion.calm) { app.finishOnboarding(createVoice: true) }
                }
            }
            .padding(.top, 4)
        }
    }

    private var stepDots: some View {
        HStack(spacing: 8) {
            ForEach(OnboardingStep.allCases, id: \.rawValue) { s in
                Circle()
                    .fill(s.rawValue == o.step.rawValue ? Palette.accent : Palette.stone)
                    .frame(width: 7, height: 7)
            }
        }
    }

    private func pill(_ text: String) -> some View {
        HStack(spacing: 7) {
            StatusDot(color: Palette.good, size: 7)
            Text(text).font(.ui(12.5, .medium)).foregroundStyle(Palette.body)
        }
        .padding(.horizontal, 12).frame(height: 30)
        .background(Capsule().fill(Palette.surface))
        .overlay(Capsule().strokeBorder(Palette.hairline, lineWidth: 1))
    }
}
