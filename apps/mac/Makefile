# Vocast Mac app builds.
#
# Beta is the default all the way to launch: it is named "Vocast Beta", carries the
# cyan icon and its own bundle id, so it installs next to a release copy and can
# never be mistaken for it. A production build is a deliberate act, see `make release`.
#
#   make beta       build the beta app and dmg
#   make quick      the same, reusing the staged engine (Swift-only changes)
#   make install    install the built beta into /Applications
#   make run        install and launch it
#   make onboarding forget first-run so onboarding shows again
#   make release    production build, guarded
#
# Run from anywhere: make -C apps/mac beta
.PHONY: beta quick install run onboarding release clean help

HERE := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
APP := $(HERE)build/Vocast Beta.app
DMG := $(HERE)build/Vocast Beta.dmg

help:
	@grep -E '^#   make' $(lastword $(MAKEFILE_LIST)) | sed 's/^#   //'

beta:
	bash "$(HERE)build_app.sh"

# Skips restaging the Python engine, which is most of the build time. Do not use
# this after touching anything under app/ or packages/voxa: it would package the
# new Swift against the old engine.
quick:
	VOCAST_SKIP_ENGINE=1 bash "$(HERE)build_app.sh"

install:
	@test -f "$(DMG)" || { echo "No dmg yet. Run: make beta"; exit 1; }
	@pkill -f "Vocast Beta.app/Contents/MacOS" 2>/dev/null || true
	hdiutil attach "$(DMG)" -nobrowse -quiet
	rm -rf "/Applications/Vocast Beta.app"
	cp -R "/Volumes/Vocast Beta/Vocast Beta.app" /Applications/
	hdiutil detach "/Volumes/Vocast Beta" -quiet
	@echo "Installed /Applications/Vocast Beta.app"

run: install
	open "/Applications/Vocast Beta.app"

# Clears the first-run flag so the onboarding screen appears again.
onboarding:
	-defaults delete me.vocast.Vocast.beta
	@echo "Onboarding will show on the next launch."

# Production. Needs both a typed confirmation and a Developer ID, enforced by
# build_app.sh, so this cannot happen by reflex:
#   VOCAST_RELEASE_CONFIRM=yes VOCAST_SIGN_ID="Developer ID Application: NAME (TEAM)" \
#   VOCAST_NOTARY_PROFILE=vocast-notary make release
release:
	VOCAST_VARIANT=release bash "$(HERE)build_app.sh"

clean:
	rm -rf "$(HERE)build/DerivedData" "$(HERE)build/dmgroot"
