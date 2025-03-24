import React, { useState, useEffect } from "react";

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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const FileNameGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<string>("");
  const [contentCategory, setContentCategory] = useState<string>("");
  const [contentTitle, setContentTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setContentType(getRandomElement(AVAILABLE_CONTENT_TYPES.flatMap(group => group.types)).value);
    setContentCategory(getRandomElement(AVAILABLE_CONTENT_CATEGORIES).value);
    setContentTitle(getRandomElement(AVAILABLE_CONTENT_TITLES));
    setLanguage(getRandomElement(AVAILABLE_LANGUAGES).value);
    setDate(formatDate(new Date())); // Set current date in YYYYMMDD format
  }, []);

  const handleContentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContentType(event.target.value);
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

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = new Date(event.target.value);
    setDate(formatDate(selectedDate));
  };

  // Extract the available content types, categories, and titles from the PDF content
  const availableContentTypes = AVAILABLE_CONTENT_TYPES;
  const availableContentCategories = AVAILABLE_CONTENT_CATEGORIES;
  const availableContentTitles = AVAILABLE_CONTENT_TITLES;
  const availableLanguages = AVAILABLE_LANGUAGES;

  return (
    <div>
      <label htmlFor="content-type-dropdown">Content Type:</label>
      <select
        id="content-type-dropdown"
        value={contentType}
        onChange={handleContentTypeChange}
      >
        <option value="">Select a content type</option>
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

      <label htmlFor="content-category-dropdown">Content Category:</label>
      <select
        id="content-category-dropdown"
        value={contentCategory}
        onChange={handleContentCategoryChange}
      >
        <option value="">Select a content category</option>
        {availableContentCategories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <label htmlFor="content-title-input">Content Title:</label>
      <input
        id="content-title-input"
        type="text"
        value={contentTitle}
        onChange={handleContentTitleChange}
      />

      <label htmlFor="language-dropdown">Language:</label>
      <select
        id="language-dropdown"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="">Select a language</option>
        {availableLanguages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <label htmlFor="date-input">Date:</label>
      <input
        id="date-input"
        type="date"
        value={date}
        onChange={handleDateChange}
      />

      {/* Add additional UI elements or logic based on the selected values */}
      <p>
        <span>{contentType}</span>_<span>{contentCategory}</span>_<span>{contentTitle}</span>_<span>{language}</span>_<span>{date}</span>
      </p>
    </div>
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