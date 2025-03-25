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
  const year = date.getFullYear() - 2000;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
  // return `${date.split('-')}`;
};

const FileNameGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<string>("");
  const [contentCategory, setContentCategory] = useState<string>("");
  const [contentTitle, setContentTitle] = useState<string>("projectName");
  const [language, setLanguage] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const contentTypeRef = useRef<HTMLSelectElement>(null);
  const contentCategoryRef = useRef<HTMLSelectElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setContentType(
      getRandomElement(AVAILABLE_CONTENT_TYPES.flatMap((group) => group.types))
        .value
    );
    setContentCategory(getRandomElement(AVAILABLE_CONTENT_CATEGORIES).value);
    setLanguage(getRandomElement(AVAILABLE_LANGUAGES).value);
    setDate(formatDate(new Date())); // Set current date in YYYYMMDD format
  }, []);

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

  const handleDateChange = (event: any) => {
    const selectedDate = new Date(event.target.value);
    setDate(formatDate(selectedDate));
  };

  const handleCopy = () => {
    const textToCopy = `${contentType}_${contentCategory}_${contentTitle}_${language}_${date}`;
    navigator.clipboard.writeText(textToCopy);
  };

  const availableContentTypes = AVAILABLE_CONTENT_TYPES;
  const availableContentCategories = AVAILABLE_CONTENT_CATEGORIES;
  const availableLanguages = AVAILABLE_LANGUAGES;

  const span: React.RefObject<any> = useRef(null);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(span?.current?.offsetWidth ?? 0);
  }, [contentTitle]);

  return (
    <>
      <div className="container">
        {/* <h1 className="title" data-element-name="StageHeadline" data-object-name="StageHeadline" data-object-counter="StageHeadlines">File Name Generator</h1> */}
        <div>
          <span className="container-select" title="Content Type">
            <span>{contentType}</span>
            <select
              id="content-type-dropdown"
              value={contentType}
              onChange={handleContentTypeChange}
              ref={contentTypeRef}
              className="select-dropdown2"
            >
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
          <span className="container-select" title="Content Category">
            <span>{contentCategory}</span>
            <select
              id="content-category-dropdown"
              value={contentCategory}
              onChange={handleContentCategoryChange}
              ref={contentCategoryRef}
              className="select-dropdown2"
            >
              <optgroup key="CONTENT CATEGORY" label="CONTENT CATEGORY">
                {availableContentCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </span>
          _
          <span className="hidden" ref={span}>
            {contentTitle}
          </span>
          <input
            type="text"
            className="input-title"
            value={contentTitle}
            style={{ width }}
            autoFocus
            onChange={handleContentTitleChange}
            title="project title"
          />
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
              <optgroup key="LANGUAGES" label="LANGUAGES">
                {availableLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </span>
          _
          <span className="container-select" title="Date">
            <span>{date}</span>
            <input
              id="date-input"
              type="date"
              onChange={handleDateChange}
              className="date-picker"
            />
          </span>
        </div>
        <button className="copy-button" onClick={handleCopy}>
          📄 copy file name
        </button>
      </div>
    </>
  );
};

export default FileNameGenerator;

const AVAILABLE_CONTENT_TYPES: ContentTypeCategory[] = [
  {
    category: "DRAWING",
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
    category: "LAYOUT",
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
    category: "VIDEO",
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
  { label: "General Content", value: "gen" },
  { label: "Fairs and Events (e.g. trade fair wall)", value: "event" },
  { label: "Campaigning (e.g. special sizes for ads)", value: "camp" },
  { label: "Sales Support", value: "sales" },
  { label: "Service Support", value: "serv" },
  { label: "Product", value: "prod" },
  { label: "Communication", value: "com" },
  { label: "Management", value: "manag" },
];

const AVAILABLE_LANGUAGES: { label: string; value: string }[] = [
  { label: "German", value: "ger" },
  { label: "French", value: "fr" },
  { label: "English", value: "en" },
];
