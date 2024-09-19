import React, { useState, useEffect, useCallback } from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const App = () => {
  const [resumeData, setResumeData] = useState({});
  const [sharedData, setSharedData] = useState({});

  const applyPickedLanguage = useCallback((pickedLanguage, oppositeLangIconId) => {
    swapCurrentlyActiveLanguage(oppositeLangIconId);
    document.documentElement.lang = pickedLanguage;
    const resumePath = 
      document.documentElement.lang === window.$primaryLanguage
        ? `res_primaryLanguage.json`
        : `res_secondaryLanguage.json`;
    loadResumeFromPath(resumePath);
  }, []);

  const swapCurrentlyActiveLanguage = (oppositeLangIconId) => {
    const pickedLangIconId =
      oppositeLangIconId === window.$primaryLanguageIconId
        ? window.$secondaryLanguageIconId
        : window.$primaryLanguageIconId;
    document
      .getElementById(oppositeLangIconId)
      .removeAttribute("filter", "brightness(40%)");
    document
      .getElementById(pickedLangIconId)
      .setAttribute("filter", "brightness(40%)");
  };

  const loadResumeFromPath = (resumePath) => {
    fetch('react-frontend-dev-portfolio/'+ resumePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setResumeData(data);
      })
      .catch((error) => {
        alert(`Failed to load data: ${error.message}`);
      });
  };

  const loadSharedData = () => {
    fetch('react-frontend-dev-portfolio/portfolio_shared_data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
          
        }
        return response.json( );
      })
      .then((data) => {
        console.log('réponse bien reçu')
        setSharedData(data);
        document.title = `${data.basic_info.name}`;
      })
      .catch((error) => alert(`Failed to load shared data: ${error.message}`));
  };
  useEffect(() => {
    loadSharedData();
    applyPickedLanguage(window.$primaryLanguage, window.$secondaryLanguageIconId);
  }, [applyPickedLanguage]); 

  return (
    <div>
      <Header sharedData={sharedData.basic_info} />
      <div className="col-md-12 mx-auto text-center language">
        <div
          onClick={() =>
            applyPickedLanguage(window.$primaryLanguage, window.$secondaryLanguageIconId)
          }
          style={{ display: "inline" }}
        >
          <span
            className="iconify language-icon mr-5"
            data-icon="twemoji-flag-for-flag-france"
            data-inline="false"
            id={window.$primaryLanguageIconId}
          ></span>
        </div>
        <div
          onClick={() =>
            applyPickedLanguage(window.$secondaryLanguage, window.$primaryLanguageIconId)
          }
          style={{ display: "inline" }}
        >
          <span
            className="iconify language-icon"
            data-icon="twemoji-flag-for-flag-united-kingdom"
            data-inline="false"
            id={window.$secondaryLanguageIconId}
          ></span>
        </div>
      </div>
      <Projects
        resumeProjects={resumeData.projects}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Skills
        sharedSkills={sharedData.skills}
        resumeBasicInfo={resumeData.basic_info}
      />
      <About
        resumeBasicInfo={resumeData.basic_info}
        sharedBasicInfo={sharedData.basic_info}
      />
      <Contact/>
      <Footer sharedBasicInfo={sharedData.basic_info} />
    </div>
  );
};

export default App;