import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import CsvJson from "./pages/CsvJson";
import Normalize from "./pages/Normalize";
import Qr from "./pages/Qr";
import Pdf from "./pages/Pdf";
import Docx from "./pages/Docx";
import Audio from "./pages/Audio";
import AudioConvert from "./pages/AudioConvert";
import Base64 from "./pages/Base64";
import UrlEncode from "./pages/UrlEncode";
import Hash from "./pages/Hash";
import JsonFormatter from "./pages/JsonFormatter";
import XmlJson from "./pages/XmlJson";
import Timestamp from "./pages/Timestamp";
import Color from "./pages/Color";
import XlsxConvert from "./pages/XlsxConvert";
import ImageFormatConvert from "./pages/ImageFormatConvert";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/csv-json" element={<CsvJson />} />
        <Route path="/tools/normalize" element={<Normalize />} />
        <Route path="/tools/qr" element={<Qr />} />
        <Route path="/tools/pdf" element={<Pdf />} />
        <Route path="/tools/docx" element={<Docx />} />
        <Route path="/tools/audio" element={<Audio />} />
        <Route path="/tools/audio-convert" element={<AudioConvert />} />
        <Route path="/tools/xlsx" element={<XlsxConvert />} />
        <Route path="/tools/image-format" element={<ImageFormatConvert />} />
        <Route path="/tools/base64" element={<Base64 />} />
        <Route path="/tools/url-encode" element={<UrlEncode />} />
        <Route path="/tools/hash" element={<Hash />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/xml-json" element={<XmlJson />} />
        <Route path="/tools/timestamp" element={<Timestamp />} />
        <Route path="/tools/color" element={<Color />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
