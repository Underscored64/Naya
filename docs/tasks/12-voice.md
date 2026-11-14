# Task 12 — Voice input (bonus, cut if late)
Read: TERAX.md only.
Do:
1. In Saisie, a microphone button using `window.SpeechRecognition || window.webkitSpeechRecognition`, `lang = "fr-FR"`. If unsupported, hide the button.
2. Result text fills the text area (never saved directly). Show listening state and handle permission denied with a friendly message.
3. Test on Chrome Mac, iPhone Safari, and an Android phone if available. Keyboard stays the main path.
Done when: dictating the example phrase fills the text area on Chrome Mac, nothing breaks on devices without support, build passes. Commit.
