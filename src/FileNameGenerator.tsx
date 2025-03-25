import React, { useState, useEffect, useRef } from "react";
import "./FileNameGenerator.css";

interface ContentType {
  label: string;
  value: string;
}

interface ContentCategory {
  label: string;
  value: string;
}

interface ContentTypeCategory {
  category: string;
  types: ContentType[];
}

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const FileNameGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<string>("");
  const [contentCategory, setContentCategory] = useState<string>("");
  const [contentTitle, setContentTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const contentTypeRef = useRef<HTMLSelectElement>(null);
  const contentCategoryRef = useRef<HTMLSelectElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContentType(
      getRandomElement(AVAILABLE_CONTENT_TYPES.flatMap((group) => group.types))
        .value
    );
    setContentCategory(getRandomElement(AVAILABLE_CONTENT_CATEGORIES).value);
    setContentTitle(getRandomElement(AVAILABLE_CONTENT_TITLES));
    setLanguage(getRandomElement(AVAILABLE_LANGUAGES).value);
    setDate(formatDate(new Date())); // Set current date in YYYYMMDD format
  }, []);

  // useEffect(() => {
  //   adjustSelectWidth(contentTypeRef);
  //   adjustSelectWidth(contentCategoryRef);
  //   adjustSelectWidth(languageRef);
  // }, [contentType, contentCategory, language]);

  // const adjustSelectWidth = (ref: React.RefObject<HTMLSelectElement | null>) => {
  //   if (ref.current) {
  //     const tempOption = document.createElement("option");
  //     console.log("ref.current.selectedOptions[0].textContent;", ref.current.selectedOptions[0].textContent)
  //     tempOption.textContent = ref.current.options[ref.current.selectedIndex].textContent;
  //     ref.current.appendChild(tempOption);
  //     ref.current.style.width = `${tempOption.offsetWidth + 50}px`;
  //     console.log("ref.current.style.width", ref.current.style.width)
  //     ref.current.removeChild(tempOption);
  //   }
  // };

  const handleContentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContentType(event.target.value);
    contentTypeRef.current?.blur();
  };

  const handleContentCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContentCategory(event.target.value);
  };

  const handleContentTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContentTitle(event.target.value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setDate(formatDate(selectedDate));
  };

  const handleCopy = () => {
    const textToCopy = `${contentType}_${contentCategory}_${contentTitle}_${language}_${date}`;
    navigator.clipboard.writeText(textToCopy);
  };

  // Extract the available content types, categories, and titles from the PDF content
  const availableContentTypes = AVAILABLE_CONTENT_TYPES;
  const availableContentCategories = AVAILABLE_CONTENT_CATEGORIES;
  const availableContentTitles = AVAILABLE_CONTENT_TITLES;
  const availableLanguages = AVAILABLE_LANGUAGES;

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <span className="container-select">
        {/* <button (onClick)={handleCopy}>erstes label</button> */}
        <span>{contentType}</span>
        <select
          id="content-type-dropdown"
          value={contentType}
          onChange={handleContentTypeChange}
          ref={contentTypeRef}
          className="select-dropdown2"
        >
          <option className="asdf" value="">
            Select a content type
          </option>
          {availableContentTypes.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </span>
      _
      <span className="container-select">
        <span>{contentCategory}</span>
        <select
          id="content-category-dropdown"
          value={contentCategory}
          onChange={handleContentCategoryChange}
          ref={contentCategoryRef}
          className="select-dropdown2"
        >
          <option value="">Select a content category</option>
          {availableContentCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </span>
      _
      <span className="container-select">
        <input
          id="content-title-input"
          type="text"
          value={contentTitle}
          onChange={handleContentTitleChange}
        />
      </span>
      _
      <span className="container-select">
        <span>{language}</span>
        <select
          id="language-dropdown"
          value={language}
          onChange={handleLanguageChange}
          ref={languageRef}
          className="select-dropdown2"
        >
          <option value="">Select a language</option>
          {availableLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {language === lang.value &&
              document.activeElement !== languageRef.current
                ? lang.value
                : lang.label}{" "}
            </option>
          ))}
        </select>
      </span>
      _
      <span>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={handleDateChange}
          ref={dateRef}
        />
      </span>
      {/* Add additional UI elements or logic based on the selected values */}
      {/* <p>
        <span>{contentType}</span>_<span>{contentCategory}</span>_
        <span>{contentTitle}</span>_<span>{language}</span>_<span>{date}</span>
      </p> */}
      <p>
        <button onClick={handleCopy}>Copy</button>
      </p>
    </>
  );
};

export default FileNameGenerator;

// Constants to store available content types, categories, titles, and languages
const AVAILABLE_CONTENT_TYPES: ContentTypeCategory[] = [
  {
    category: "DRAWINGS dra (ContentType)",
    types: [
      { label: "CharacteristicCurve", value: "CCdra" },
      { label: "Grafic", value: "GRAFdra" },
      { label: "Illustration", value: "ILLdra" },
      { label: "SectionalDrawing", value: "SDdra" },
      { label: "Logos", value: "LOGdra" },
      { label: "Product", value: "prod" },
    ],
  },
  {
    category: "LAYOUTS lay (ContentType)",
    types: [
      { label: "Brochure", value: "BROlay" },
      { label: "Flyer", value: "FLYlay" },
      { label: "Know-How", value: "KNOWlay" },
      { label: "OnePaper", value: "P1lay" },
      { label: "TwoPaper", value: "P2Play" },
      { label: "ReferenceLeaflets", value: "REFlay" },
      { label: "WhitePaper", value: "WPlay" },
      { label: "Presentations", value: "PPTlay" },
      { label: "Advertising", value: "ADlay" },
      { label: "Keyvisual", value: "KEYlay" },
      { label: "TradeFair", value: "TFlay" },
      { label: "CircularWall", value: "CWALLlay" },
      { label: "RollUp", value: "ROLLUPlay" },
      { label: "Poster", value: "PSlay" },
      { label: "Labelling", value: "LABlay" },
    ],
  },
  {
    category: "VIDEOS video (ContentType)",
    types: [
      { label: "ExpertVideo", value: "EXPvideo" },
      { label: "QuickGuideVideo", value: "GUIDvideo" },
      { label: "FootageVideo", value: "FOOTvideo" },
      { label: "OnlineSeminarVideo", value: "SEMINvideo" },
      { label: "ProductVideo", value: "PRODvideo" },
      { label: "DocumentaryVideo", value: "DOCVideo" },
      { label: "ImageVideo", value: "IMAGVideo" },
      { label: "StoryTellingVideo", value: "STORYvideo" },
      { label: "Message&NewsVideo", value: "NEW" },
    ],
  },
];

const AVAILABLE_CONTENT_CATEGORIES: ContentCategory[] = [
  { label: "ContentCategory (Marketing Themen)", value: "ContentCategory" },
  { label: "General Content", value: "gen" },
  { label: "Fairs and Events (e.g. trade fair wall)", value: "event" },
  { label: "Campaigning (e.g. special sizes for ads)", value: "camp" },
  { label: "Sales Support", value: "sales" },
  { label: "Service Support", value: "serv" },
  { label: "Product", value: "prod" },
  { label: "Communication", value: "com" },
  { label: "Management", value: "manag" },
];

const AVAILABLE_CONTENT_TITLES: string[] = ["ISH2025"];

const AVAILABLE_LANGUAGES: { label: string; value: string }[] = [
  { label: "German", value: "ger" },
  { label: "French", value: "fr" },
  { label: "English", value: "en" },
];
