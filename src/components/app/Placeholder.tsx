// A coming-soon placeholder for the screens built in later tasks
// (Saisie 07, Prévision 08, Dettes 10). Keeps the tab bar complete now.
export default function Placeholder({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="card app-placeholder">
      <h2 className="app-placeholder__title">{title}</h2>
      <p>{message}</p>
    </section>
  );
}
