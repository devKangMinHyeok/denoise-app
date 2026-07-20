import SwiftUI

// MARK: - Script advice banner
//
// Sits above the editor and is silent almost always. Mixed script is the ordinary
// shape of Korean technical writing, so it never raises a warning; at most it earns
// one calm green line so the user does not wonder whether mixing was a mistake.
// Only a whole paragraph in a language the voice cannot speak turns amber, and even
// then it is a note, never a block: rendering always stays available.

struct ScriptAdviceBanner: View {
    @Environment(AppModel.self) private var app

    var body: some View {
        switch app.scriptAdvice {
        case .none:
            EmptyView()

        case .mixedIsFine:
            row(icon: "checkmark.circle", tint: Palette.good,
                text: app.s.f("mixedOk",
                              a: app.s.nameOf(app.currentVoiceLanguage == .ko ? .en : .ko),
                              b: app.s.nameOf(app.currentVoiceLanguage)),
                bg: Palette.good.opacity(0.06), border: Palette.good.opacity(0.28))

        case .mismatch(let detected):
            row(icon: "exclamationmark.triangle", tint: Palette.accent,
                text: app.s.f("mismatchBanner",
                              a: app.s.nameOf(detected),
                              b: app.s.nameOf(app.currentVoiceLanguage)),
                bg: Palette.accent.opacity(0.06), border: Palette.accent.opacity(0.35))
        }
    }

    private func row(icon: String, tint: Color, text: String,
                     bg: Color, border: Color) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon).font(.system(size: 12)).foregroundStyle(tint)
            Text(text).font(.ui(13)).foregroundStyle(Palette.body)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 14).padding(.vertical, 11)
        .background(RoundedRectangle(cornerRadius: Radius.control, style: .continuous).fill(bg))
        .overlay(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
            .strokeBorder(border, lineWidth: 1))
        .transition(.opacity)
    }
}

/// The per-block echo of the same finding, shown on a rendered block whose text is
/// in another language. Amber, small, and never in the way of the block's controls.
struct DifferentLanguageTag: View {
    @Environment(AppModel.self) private var app

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: "exclamationmark.triangle").font(.system(size: 9))
            Text(app.s["mismatchTag"]).font(.mono(11))
        }
        .foregroundStyle(Palette.accent)
        .padding(.horizontal, 8).frame(height: 22)
        .overlay(Capsule().strokeBorder(Palette.accent.opacity(0.45), lineWidth: 1))
    }
}

// MARK: - No-baseline scorecard
//
// The prosody gate, the golden fixtures and the human baseline were all measured on
// Korean. For any other language those numbers would be scored against a baseline
// that does not apply, so they are withheld rather than shown.
//
// The handoff also lists SIM and CER as still-measured here. This engine does not
// compute either during a render, and the library SIM needs is not in the shipped
// bundle, so showing them would mean inventing numbers. The honesty rule wins: the
// panel says what is not available instead.

struct NoBaselineScorecard: View {
    @Environment(AppModel.self) private var app
    var language: VoiceLanguage

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 10) {
                Circle().fill(Palette.accentBlue).frame(width: 8, height: 8)
                Text(app.s.f("noBaselineGate", b: app.s.nameOf(language)))
                    .font(.ui(14, .semibold)).foregroundStyle(Palette.ink)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(14).frame(maxWidth: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .fill(Palette.accentBlue.opacity(0.06)))
            .overlay(RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .strokeBorder(Palette.accentBlue.opacity(0.3), lineWidth: 1))

            Text(app.s.f("noBaselineBody", b: app.s.nameOf(language)))
                .font(.ui(13)).foregroundStyle(Palette.mute)
                .lineSpacing(4).fixedSize(horizontal: false, vertical: true)
        }
    }
}
