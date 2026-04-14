import styles from './App.module.css';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Experience } from './components/Experience/Experience';
import { Project } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import { Admin } from './components/Admin/Admin';
import { usePortfolioContent } from './hooks/usePortfolioContent';

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const isAdminRoute = pathname === '/admin';
  const { content } = usePortfolioContent(!isAdminRoute);

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <div className={styles.App}>
      <Navbar />
      <Hero hero={content.hero} />
      <About />
      <Experience skills={content.skills} history={content.history} />
      <Project projects={content.projects} />
      <Contact contact={content.contact} />
    </div>
  );
}

export default App;
