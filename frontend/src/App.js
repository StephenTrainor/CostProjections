import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quote from './pages/Quote';
import styles from './App.module.css';
import PageNotFound from './pages/PageNotFound';

const App = () => {
  return (
    <div className={styles.gradientBackground}>
      <div className={styles.reactContent}>
        <div className={styles.overflowToScroll}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </div>
      </div>
      <svg className={styles.waves} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className={styles.parallax}>
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

export default App;

/*
destructure input field props
simplify input fields
*/
