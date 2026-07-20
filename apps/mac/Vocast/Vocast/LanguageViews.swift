import SwiftUI

// MARK: - Language chip
//
// The recurring "this voice speaks X" signal. The same chip appears on a library
// card, a profile header and the Studio profile selector, so the association
// between a voice and its language is learned once and read everywhere.

struct LanguageChip: View {
    var language: VoiceLanguage
    /// Locked chips carry a lock glyph instead of the mic, used during recording
    /// where the language can no longer be changed.
    var locked = false
    var label: String?

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: locked ? "lock.fill" : "mic")
                .font(.system(size: 10, weight: .regular))
            if let label {
                Text(label).font(.mono(11)).foregroundStyle(Palette.ash)
            }
            Text(language.nativeName).font(.mono(11))
        }
        .foregroundStyle(Palette.mute)
        .padding(.horizontal, 8).frame(height: 22)
        .overlay(Capsule().strokeBorder(Palette.hairline, lineWidth: 1))
    }
}

// MARK: - Language option card
//
// Used by both the onboarding interface pick and the voice language pick, so the
// two reads as the same kind of decision even though they set different things.

struct LanguageOptionCard: View {
    var title: String
    var note: String?
    var selected: Bool
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(title).font(.ui(15, .semibold)).foregroundStyle(Palette.ink)
                    if let note {
                        Text(note).font(.mono(11)).foregroundStyle(Palette.ash)
                            .lineLimit(1).fixedSize()
                    }
                }
                Spacer(minLength: 8)
                if selected {
                    Image(systemName: "checkmark")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Palette.accent)
                }
            }
            .padding(.horizontal, 16).frame(height: 62)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .fill(selected ? Palette.accent.opacity(0.06) : Palette.surface))
            .overlay(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .strokeBorder(selected ? Palette.accent : Palette.hairline, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Voices: pick the voice language
//
// A step of its own, before any recording. This is the only moment the language
// can be set: the guided lines and the transcription that trains the clone are
// both written for it, so changing it later would mean rebuilding the voice.

struct PickVoiceLanguage: View {
    @Environment(AppModel.self) private var app
    private var v: VoicesModel { app.voices }
    private var s: Strings { app.s }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.lg) {
                Button { app.voices.phase = .library } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "chevron.left").font(.system(size: 11, weight: .semibold))
                        Text(s["nVoices"]).font(.ui(13.5))
                    }.foregroundStyle(Palette.mute)
                }.buttonStyle(.plain)

                VStack(alignment: .leading, spacing: 8) {
                    Text(s["pickLangTitle"]).font(.ui(22, .semibold)).foregroundStyle(Palette.ink)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(s["pickLangBody"]).font(.ui(14)).foregroundStyle(Palette.mute)
                        .lineSpacing(4).fixedSize(horizontal: false, vertical: true)
                }

                HStack(spacing: 16) {
                    ForEach(VoiceLanguage.allCases) { lang in
                        LanguageOptionCard(
                            title: lang.nativeName,
                            // Say plainly which languages have a validated quality
                            // baseline, since it changes what the scorecard can show.
                            note: lang.hasQualityBaseline
                                ? s["baselineValidated"] : s["noBaselineYet"],
                            selected: v.lang == lang
                        ) { app.voices.lang = lang; app.loadGuide() }
                    }
                }

                HStack(spacing: 10) {
                    Image(systemName: "lock").font(.system(size: 12)).foregroundStyle(Palette.mute)
                    Text(s["pickLangLocked"]).font(.ui(13)).foregroundStyle(Palette.mute)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(14).frame(maxWidth: .infinity, alignment: .leading)
                .card(Palette.surface, radius: Radius.control)

                PrimaryButton(title: "\(s["startRecording"]) · \(v.lang.nativeName)",
                              systemImage: "mic.fill") {
                    app.beginVoiceRecording()
                }
            }
            .padding(Space.xl)
            .frame(maxWidth: 600)
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - The guarantee note
//
// Shown briefly whenever the interface language changes. The one thing users need
// to trust is that switching the UI did not touch their voices, so the app says it
// rather than leaving them to check.

struct LanguageGuaranteeNote: View {
    @Environment(AppModel.self) private var app

    var body: some View {
        if app.languageNoteVisible {
            HStack(spacing: 10) {
                Image(systemName: "info.circle")
                    .font(.system(size: 13)).foregroundStyle(Palette.accentBlue)
                Text(app.s["guaranteeNote"]).font(.ui(13)).foregroundStyle(Palette.body)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .fill(Palette.accentBlue.opacity(0.06)))
            .overlay(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .strokeBorder(Palette.accentBlue.opacity(0.3), lineWidth: 1))
            .transition(.opacity.combined(with: .move(edge: .top)))
        }
    }
}
