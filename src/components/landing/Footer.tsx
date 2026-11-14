export default function Footer() {
  return (
    <footer className="landing-footer container">
      <p>Naya · {new Date().getFullYear()}</p>
      <p className="landing-footer__note">
        Démo avec données fictives — commerçante « Ama ».
      </p>
    </footer>
  );
}
