import React, { useState, useEffect, useRef, useMemo } from "react";
import "./FileNameGenerator.css";


const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear() - 2000;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const FileNameGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<string>("");
  const [contentCategory, setContentCategory] = useState<string>("");
  const [contentTitle, setContentTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("Language");
  const [date, setDate] = useState<string>("Date");
  const [mediaArt, setMediaArt] = useState<string>("");
  const [country, setCountry] = useState<string>("Country");
  const [errorMessage, setErrorMessage] = useState<string>(""); // New state for error message
  const [successMessage, setSuccessMessage] = useState<string>(""); // New state for success message
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false); // Track focus state

  const contentTypeRef = useRef<HTMLSelectElement>(null);
  const contentCategoryRef = useRef<HTMLSelectElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const mediaArtRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {return
    const allContentTypes = Object.values(AVAILABLE_CONTENT_TYPES).flat(); // Flatten the content types

    // setContentType(getRandomElement(allContentTypes).value); // Select a random content type
    // setContentType("ContentType");
    const allContentCategories = Object.values(AVAILABLE_CONTENT_CATEGORIES).flat(); // Flatten the content categories
    setContentCategory(getRandomElement(allContentCategories).value); // Select a random content category

    setLanguage("Language");
    // setDate(formatDate(new Date()));
    setDate("Date");
    // setMediaArt("MediaArt");
    setCountry("Country");
  }, []);
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setDate(event.target.value.replace(/-/g, "")); // Format date as YYYYMMDD
    setDate(formatDate(event.target.value)); // Format date as YYYYMMDD
  };

  useEffect(() => {
    // Load stored content titles from localStorage on component mount
    const storedTitles = JSON.parse(localStorage.getItem("contentTitles") || "[]");
    setSuggestions(storedTitles);
  }, []);

  const handleContentTitleChange = (event: React.FormEvent<HTMLSpanElement>) => {
    const newTitle = event.currentTarget.textContent || "";
    setContentTitle(newTitle);

    // Show suggestions only if the user has entered something
    if (newTitle.trim() !== "") {
      const storedTitles = JSON.parse(localStorage.getItem("contentTitles") || "[]");
      const filteredSuggestions = storedTitles.filter((title: string) =>
        title.toLowerCase().includes(newTitle.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setContentTitle(suggestion);
    setSuggestions([]); // Clear suggestions after selection
    setIsFocused(false); // Hide suggestions
  };

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

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleMediaArtChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMediaArt = event.target.value;
    setMediaArt(selectedMediaArt);

    // Automatically select the first option in the filtered content types
    const firstContentType = AVAILABLE_CONTENT_TYPES[selectedMediaArt]?.[0]?.value || "";
    setContentType(firstContentType);

    // Automatically select the first option in the filtered content categories
    const firstContentCategory = AVAILABLE_CONTENT_CATEGORIES[selectedMediaArt]?.[0]?.value || "";
    setContentCategory(firstContentCategory);
  };

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCountry(event.target.value);
  };

  const handleCopy = () => {
    // Validation logic
    if (date === "Date") {
      setErrorMessage("Please select a valid date.");
      setSuccessMessage(""); // Clear success message
      return;
    }
    if (mediaArt === "MediaArt" || mediaArt === "") {
      setErrorMessage("Please select a valid Media Art.");
      setSuccessMessage(""); // Clear success message
      return;
    }
    if (contentTitle.trim() === "") {
      setErrorMessage("Please enter the Project Name.");
      setSuccessMessage(""); // Clear success message
      return;
    }
    // if (contentCategory === "ContentCategory") {
    //   setErrorMessage("Please select a valid Content Category.");
    //   setSuccessMessage(""); // Clear success message
    //   return;
    // }

    // Clear error message if all validations pass
    setErrorMessage("");

    const languagePart = language !== "Language" ? `_${language}` : "";
    const countryPart = country !== "Country" ? `_${country}` : "";
    const contentTypePart = contentType !== "" ? `_${contentType}` : "";
    const contentCategoryPart = contentCategory !== "" ? `_${contentCategory}` : "";
    const textToCopy = `${date}_${mediaArt}_${contentTitle}${contentTypePart}${contentCategoryPart}${languagePart}${countryPart}`;

    // Update localStorage with the new contentTitle
    const storedTitles = JSON.parse(localStorage.getItem("contentTitles") || "[]");
    if (!storedTitles.includes(contentTitle)) {
      const updatedTitles = [...storedTitles, contentTitle];
      localStorage.setItem("contentTitles", JSON.stringify(updatedTitles));
    }

    // Copy the file name to the clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
      setSuccessMessage("File name copied successfully!"); // Set success message
    }).catch(() => {
      setErrorMessage("Failed to copy the file name."); // Handle copy failure
    });
  };

  const filteredContentTypes = useMemo(() => AVAILABLE_CONTENT_TYPES[mediaArt] || [], [mediaArt]);
  const filteredContentCategories = useMemo(() => AVAILABLE_CONTENT_CATEGORIES[mediaArt] || [], [mediaArt]);

  return (
    <>
      <div className="container">
        <div>
          <span className="container-select" title="Date">
            <span>{date}</span>
            <input
              id="date-input"
              type="date"
              onChange={handleDateChange}
              className="date-picker"
            />
          </span>
          <span>_</span>
          <span className="container-select" title="Media Art">
            {mediaArt === "" && <span>MediaArt</span>}
            <span>{mediaArt}</span>
            <select
              id="media-art-dropdown"
              value={mediaArt}
              onChange={handleMediaArtChange}
              ref={mediaArtRef}
              className="select-dropdown2"
            >
              <option value="" disabled>
                Select Media Art
              </option>
              {AVAILABLE_MEDIA_ARTS.map((art) => (
                <option key={art.value} value={art.value}>
                  {art.label}
                </option>
              ))}
            </select>
          </span>
          <span>_</span>
          <span style={{ position: "relative" }}>
            <span
              contentEditable="true"
              className="input-title"
              onInput={handleContentTitleChange}
              onFocus={() => setIsFocused(true)} // Show suggestions on focus
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide suggestions on blur with delay
              suppressContentEditableWarning={true}
            >
              {contentTitle === "" ? "ProjectName" : contentTitle}
            </span>
            {isFocused && suggestions.length > 0 && (
              <ul className="autocomplete-suggestions">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </span>
          {filteredContentTypes.length > 0 && <>
            <span>_</span>
            <span className="container-select" title="Content Type">
              <span>{contentType === "" ? "contentType" : contentType}</span>
              <select
                id="content-type-dropdown"
                value={contentType}
                onChange={handleContentTypeChange}
                ref={contentTypeRef}
                className="select-dropdown2"
              >
                <option value="" disabled>
                  Select Content Type
                </option>
                {filteredContentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </span>
          </>
          }
          <span>_</span>
          {filteredContentCategories.length > 0 && (
            <>
              <span className="container-select" title="Content Category">
                <span>{contentCategory}</span>
                <select
                  id="content-category-dropdown"
                  value={contentCategory}
                  onChange={handleContentCategoryChange}
                  ref={contentCategoryRef}
                  className="select-dropdown2"
                >
                  <option value="" disabled>
                    Select Content Category
                  </option>
                  {filteredContentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </span>
              <span>_</span>
            </>

          )}
          <span
            className={`container-select ${language === "Language" ? "unset" : ""}`}
            title="Language"
          >
            <span>{language}</span>
            <select
              id="language-dropdown"
              value={language}
              onChange={handleLanguageChange}
              ref={languageRef}
              className="select-dropdown2"
            >
              <option value="" disabled>
                Select Language
              </option>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </span>
          _
          <span className={`container-select ${country === "Country" ? "unset" : ""}`} title="Country">
            <span>{country}</span>
            <select
              id="country-dropdown"
              value={country}
              onChange={handleCountryChange}
              ref={countryRef}
              className="select-dropdown2"
            >
              <option value="" disabled>
                Select Country
              </option>
              {AVAILABLE_COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </span>
        </div>
        <br />
        <button className="copy-button" onClick={handleCopy}>
          📄 Copy File Name
        </button>
        {errorMessage && <span style={{ color: "red", height: 0 }}>{errorMessage}</span>}
        {successMessage && (
          <span style={{ color: "green", height: 0 }}>
            ✅ {successMessage}
          </span>
        )}
      </div >
    </>
  );
};

export default FileNameGenerator;

const AVAILABLE_CONTENT_TYPES: { [key: string]: { label: string; value: string }[] } = {
  KSBlay: [
    { label: "Brochure", value: "BRO" },
    { label: "Flyer", value: "FLY" },
    { label: "OnePager", value: "P1" },
    { label: "TwoPager", value: "P2" },
    { label: "WhitePaper", value: "WP" },
    { label: "Presentations", value: "PPT" },
    { label: "Advertising", value: "AD" },
    { label: "Keyvisual", value: "KEY" },
    { label: "TradeFairPanels", value: "TFP" },
    { label: "PopUpPanels", value: "POP" },
    { label: "RollUp", value: "ROLL" },
    { label: "Poster", value: "PS" },
    { label: "PromotionalArticle", value: "PA" },
    { label: "Invitation", value: "INV" },
    { label: "ScreenDesign", value: "SD" },
    { label: "ReferenceLeaflets", value: "REF" },
  ],
  KSBvid: [
    { label: "Expert", value: "EXP" },
    { label: "QuickGuide", value: "GUID" },
    { label: "Product", value: "PROD" },
    { label: "Image", value: "IMAG" },
    { label: "StoryTelling", value: "STORY" },
    { label: "Message&News", value: "NEWS" },
    { label: "Teaser", value: "TEAS" },
    { label: "Advertorialvideo", value: "AD" },
    { label: "Documentary", value: "DOCU" },
    { label: "OnlineSeminar", value: "SEM" },
    { label: "Footage", value: "FOOT" },
    { label: "LiveStream ", value: "LIVE" },
  ],
  KSBdrw: [
    { label: "CharacteristicCurve", value: "CURV" },
    { label: "SectionalDrawing", value: "SD" },
    { label: "Logos", value: "LOG" },
    { label: "Illustration", value: "ILL" },
    { label: "Layout", value: "LAY" },
  ],
  KSBimg: [], // No options for KSBimg
};

const AVAILABLE_CONTENT_CATEGORIES: { [key: string]: { label: string; value: string }[] } = {
  KSBlay: [
    { label: "General Content", value: "gen" },
    { label: "Fairs and Events", value: "event" },
    { label: "Campaigning", value: "camp" },
    { label: "Sales Support", value: "sales" },
    { label: "Service Support", value: "serv" },
    { label: "Product", value: "prod" },
    { label: "People", value: "peopl" },
    { label: "Know-How", value: "know" },
  ],
  KSBvid: [], // No options for KSBvid
  KSBdrw: [], // No options for KSBdrw
  KSBimg: [], // No options for KSBimg
};

const AVAILABLE_LANGUAGES: { label: string; value: string }[] = [
  { label: "None", value: "" },
  { label: "Afrikaans", value: "af" },
  { label: "Albanian", value: "sq" },
  { label: "Amharic", value: "am" },
  { label: "Arabic", value: "ar" },
  { label: "Armenian", value: "hy" },
  { label: "Azerbaijani", value: "az" },
  { label: "Basque", value: "eu" },
  { label: "Belarusian", value: "be" },
  { label: "Bengali", value: "bn" },
  { label: "Bosnian", value: "bs" },
  { label: "Bulgarian", value: "bg" },
  { label: "Catalan", value: "ca" },
  { label: "Chinese (Simplified)", value: "zh-CN" },
  { label: "Chinese (Traditional)", value: "zh-TW" },
  { label: "Croatian", value: "hr" },
  { label: "Czech", value: "cs" },
  { label: "Danish", value: "da" },
  { label: "Dutch", value: "nl" },
  { label: "English", value: "en" },
  { label: "Esperanto", value: "eo" },
  { label: "Estonian", value: "et" },
  { label: "Finnish", value: "fi" },
  { label: "French", value: "fr" },
  { label: "Galician", value: "gl" },
  { label: "Georgian", value: "ka" },
  { label: "German", value: "de" },
  { label: "Greek", value: "el" },
  { label: "Gujarati", value: "gu" },
  { label: "Haitian Creole", value: "ht" },
  { label: "Hebrew", value: "he" },
  { label: "Hindi", value: "hi" },
  { label: "Hungarian", value: "hu" },
  { label: "Icelandic", value: "is" },
  { label: "Indonesian", value: "id" },
  { label: "Irish", value: "ga" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "ja" },
  { label: "Javanese", value: "jv" },
  { label: "Kannada", value: "kn" },
  { label: "Kazakh", value: "kk" },
  { label: "Khmer", value: "km" },
  { label: "Korean", value: "ko" },
  { label: "Kurdish", value: "ku" },
  { label: "Kyrgyz", value: "ky" },
  { label: "Lao", value: "lo" },
  { label: "Latvian", value: "lv" },
  { label: "Lithuanian", value: "lt" },
  { label: "Luxembourgish", value: "lb" },
  { label: "Macedonian", value: "mk" },
  { label: "Malagasy", value: "mg" },
  { label: "Malay", value: "ms" },
  { label: "Malayalam", value: "ml" },
  { label: "Maltese", value: "mt" },
  { label: "Maori", value: "mi" },
  { label: "Marathi", value: "mr" },
  { label: "Mongolian", value: "mn" },
  { label: "Nepali", value: "ne" },
  { label: "Norwegian", value: "no" },
  { label: "Pashto", value: "ps" },
  { label: "Persian", value: "fa" },
  { label: "Polish", value: "pl" },
  { label: "Portuguese", value: "pt" },
  { label: "Punjabi", value: "pa" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Samoan", value: "sm" },
  { label: "Serbian", value: "sr" },
  { label: "Sinhala", value: "si" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Somali", value: "so" },
  { label: "Spanish", value: "es" },
  { label: "Sundanese", value: "su" },
  { label: "Swahili", value: "sw" },
  { label: "Swedish", value: "sv" },
  { label: "Tagalog", value: "tl" },
  { label: "Tajik", value: "tg" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Thai", value: "th" },
  { label: "Turkish", value: "tr" },
  { label: "Ukrainian", value: "uk" },
  { label: "Urdu", value: "ur" },
  { label: "Uzbek", value: "uz" },
  { label: "Vietnamese", value: "vi" },
  { label: "Welsh", value: "cy" },
  { label: "Xhosa", value: "xh" },
  { label: "Yiddish", value: "yi" },
  { label: "Yoruba", value: "yo" },
  { label: "Zulu", value: "zu" },
];

const AVAILABLE_COUNTRIES: { label: string; value: string }[] = [
  { label: "None", value: "" },
  { label: "Afghanistan", value: "af" },
  { label: "Albania", value: "al" },
  { label: "Algeria", value: "dz" },
  { label: "Andorra", value: "ad" },
  { label: "Angola", value: "ao" },
  { label: "Argentina", value: "ar" },
  { label: "Armenia", value: "am" },
  { label: "Australia", value: "au" },
  { label: "Austria", value: "at" },
  { label: "Azerbaijan", value: "az" },
  { label: "Bahamas", value: "bs" },
  { label: "Bahrain", value: "bh" },
  { label: "Bangladesh", value: "bd" },
  { label: "Barbados", value: "bb" },
  { label: "Belarus", value: "by" },
  { label: "Belgium", value: "be" },
  { label: "Belize", value: "bz" },
  { label: "Benin", value: "bj" },
  { label: "Bhutan", value: "bt" },
  { label: "Bolivia", value: "bo" },
  { label: "Bosnia and Herzegovina", value: "ba" },
  { label: "Botswana", value: "bw" },
  { label: "Brazil", value: "br" },
  { label: "Brunei", value: "bn" },
  { label: "Bulgaria", value: "bg" },
  { label: "Burkina Faso", value: "bf" },
  { label: "Burundi", value: "bi" },
  { label: "Cambodia", value: "kh" },
  { label: "Cameroon", value: "cm" },
  { label: "Canada", value: "ca" },
  { label: "Cape Verde", value: "cv" },
  { label: "Central African Republic", value: "cf" },
  { label: "Chad", value: "td" },
  { label: "Chile", value: "cl" },
  { label: "China", value: "cn" },
  { label: "Colombia", value: "co" },
  { label: "Comoros", value: "km" },
  { label: "Congo", value: "cg" },
  { label: "Costa Rica", value: "cr" },
  { label: "Croatia", value: "hr" },
  { label: "Cuba", value: "cu" },
  { label: "Cyprus", value: "cy" },
  { label: "Czech Republic", value: "cz" },
  { label: "Denmark", value: "dk" },
  { label: "Djibouti", value: "dj" },
  { label: "Dominica", value: "dm" },
  { label: "Dominican Republic", value: "do" },
  { label: "Ecuador", value: "ec" },
  { label: "Egypt", value: "eg" },
  { label: "El Salvador", value: "sv" },
  { label: "Equatorial Guinea", value: "gq" },
  { label: "Eritrea", value: "er" },
  { label: "Estonia", value: "ee" },
  { label: "Eswatini", value: "sz" },
  { label: "Ethiopia", value: "et" },
  { label: "Fiji", value: "fj" },
  { label: "Finland", value: "fi" },
  { label: "France", value: "fr" },
  { label: "Gabon", value: "ga" },
  { label: "Gambia", value: "gm" },
  { label: "Georgia", value: "ge" },
  { label: "Germany", value: "ger" },
  { label: "Ghana", value: "gh" },
  { label: "Greece", value: "gr" },
  { label: "Grenada", value: "gd" },
  { label: "Guatemala", value: "gt" },
  { label: "Guinea", value: "gn" },
  { label: "Guinea-Bissau", value: "gw" },
  { label: "Guyana", value: "gy" },
  { label: "Haiti", value: "ht" },
  { label: "Honduras", value: "hn" },
  { label: "Hungary", value: "hu" },
  { label: "Iceland", value: "is" },
  { label: "India", value: "in" },
  { label: "Indonesia", value: "id" },
  { label: "Iran", value: "ir" },
  { label: "Iraq", value: "iq" },
  { label: "Ireland", value: "ie" },
  { label: "Israel", value: "il" },
  { label: "Italy", value: "it" },
  { label: "Jamaica", value: "jm" },
  { label: "Japan", value: "jp" },
  { label: "Jordan", value: "jo" },
  { label: "Kazakhstan", value: "kz" },
  { label: "Kenya", value: "ke" },
  { label: "Kiribati", value: "ki" },
  { label: "Korea (North)", value: "kp" },
  { label: "Korea (South)", value: "kr" },
  { label: "Kuwait", value: "kw" },
  { label: "Kyrgyzstan", value: "kg" },
  { label: "Laos", value: "la" },
  { label: "Latvia", value: "lv" },
  { label: "Lebanon", value: "lb" },
  { label: "Lesotho", value: "ls" },
  { label: "Liberia", value: "lr" },
  { label: "Libya", value: "ly" },
  { label: "Liechtenstein", value: "li" },
  { label: "Lithuania", value: "lt" },
  { label: "Luxembourg", value: "lu" },
  { label: "Madagascar", value: "mg" },
  { label: "Malawi", value: "mw" },
  { label: "Malaysia", value: "my" },
  { label: "Maldives", value: "mv" },
  { label: "Mali", value: "ml" },
  { label: "Malta", value: "mt" },
  { label: "Marshall Islands", value: "mh" },
  { label: "Mauritania", value: "mr" },
  { label: "Mauritius", value: "mu" },
  { label: "Mexico", value: "mx" },
  { label: "Micronesia", value: "fm" },
  { label: "Moldova", value: "md" },
  { label: "Monaco", value: "mc" },
  { label: "Mongolia", value: "mn" },
  { label: "Montenegro", value: "me" },
  { label: "Morocco", value: "ma" },
  { label: "Mozambique", value: "mz" },
  { label: "Myanmar", value: "mm" },
  { label: "Namibia", value: "na" },
  { label: "Nauru", value: "nr" },
  { label: "Nepal", value: "np" },
  { label: "Netherlands", value: "nl" },
  { label: "New Zealand", value: "nz" },
  { label: "Nicaragua", value: "ni" },
  { label: "Niger", value: "ne" },
  { label: "Nigeria", value: "ng" },
  { label: "North Macedonia", value: "mk" },
  { label: "Norway", value: "no" },
  { label: "Oman", value: "om" },
  { label: "Pakistan", value: "pk" },
  { label: "Palau", value: "pw" },
  { label: "Panama", value: "pa" },
  { label: "Papua New Guinea", value: "pg" },
  { label: "Paraguay", value: "py" },
  { label: "Peru", value: "pe" },
  { label: "Philippines", value: "ph" },
  { label: "Poland", value: "pl" },
  { label: "Portugal", value: "pt" },
  { label: "Qatar", value: "qa" },
  { label: "Romania", value: "ro" },
  { label: "Russia", value: "ru" },
  { label: "Rwanda", value: "rw" },
  { label: "Saint Kitts and Nevis", value: "kn" },
  { label: "Saint Lucia", value: "lc" },
  { label: "Saint Vincent and the Grenadines", value: "vc" },
  { label: "Samoa", value: "ws" },
  { label: "San Marino", value: "sm" },
  { label: "Sao Tome and Principe", value: "st" },
  { label: "Saudi Arabia", value: "sa" },
  { label: "Senegal", value: "sn" },
  { label: "Serbia", value: "rs" },
  { label: "Seychelles", value: "sc" },
  { label: "Sierra Leone", value: "sl" },
  { label: "Singapore", value: "sg" },
  { label: "Slovakia", value: "sk" },
  { label: "Slovenia", value: "si" },
  { label: "Solomon Islands", value: "sb" },
  { label: "Somalia", value: "so" },
  { label: "South Africa", value: "za" },
  { label: "Spain", value: "es" },
  { label: "Sri Lanka", value: "lk" },
  { label: "Sudan", value: "sd" },
  { label: "Suriname", value: "sr" },
  { label: "Sweden", value: "se" },
  { label: "Switzerland", value: "ch" },
  { label: "Syria", value: "sy" },
  { label: "Taiwan", value: "tw" },
  { label: "Tajikistan", value: "tj" },
  { label: "Tanzania", value: "tz" },
  { label: "Thailand", value: "th" },
  { label: "Togo", value: "tg" },
  { label: "Tonga", value: "to" },
  { label: "Trinidad and Tobago", value: "tt" },
  { label: "Tunisia", value: "tn" },
  { label: "Turkey", value: "tr" },
  { label: "Turkmenistan", value: "tm" },
  { label: "Tuvalu", value: "tv" },
  { label: "Uganda", value: "ug" },
  { label: "Ukraine", value: "ua" },
  { label: "United Arab Emirates", value: "ae" },
  { label: "United Kingdom", value: "uk" },
  { label: "United States", value: "us" },
  { label: "Uruguay", value: "uy" },
  { label: "Uzbekistan", value: "uz" },
  { label: "Vanuatu", value: "vu" },
  { label: "Vatican City", value: "va" },
  { label: "Venezuela", value: "ve" },
  { label: "Vietnamese", value: "vi" },
  { label: "Welsh", value: "cy" },
  { label: "Xhosa", value: "xh" },
  { label: "Yiddish", value: "yi" },
  { label: "Yoruba", value: "yo" },
  { label: "Zulu", value: "zu" },
];

const AVAILABLE_MEDIA_ARTS: { label: string; value: string }[] = [
  { label: "KSB Layout", value: "KSBlay" },
  { label: "KSB Video", value: "KSBvid" },
  { label: "KSB Drawings", value: "KSBdrw" },
  { label: "KSB images + Image Number", value: "KSBimg" },
];
