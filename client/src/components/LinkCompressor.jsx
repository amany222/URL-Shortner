import { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader"; // Different loader

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

function LinkCompressor({ onNewLink }) {
  const [linkText, setLinkText] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  const handleLinkUpdate = (e) => setLinkText(e.target.value);

  const compressLink = async () => {
    if (!linkText) return;

    setIsCompressing(true);
    try {
      const res = await fetch(`${API_ENDPOINT}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullLink: linkText }),
      });

      if (res.status === 503) {
        alert("Service unavailable at this time.");
        setLinkText("");
        setIsCompressing(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        alert(data.errorMsg || "Failed to compress link.");
        setLinkText("");
        setIsCompressing(false);
        return;
      }

      const compressedLink = {
        source: linkText,
        tinyLink: data.compactUrl,
      };
      onNewLink(compressedLink);
      setLinkText("");
      setIsCompressing(false);
    } catch (err) {
      alert("Error processing your request.");
      setLinkText("");
      setIsCompressing(false);
    }
  };

  const loaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
  };

  return (
    <section className="link-compressor box-border">
      <form onSubmit={(e) => e.preventDefault()} className="input-form">
        <div className="text-entry">
          <input
            type="url"
            value={linkText}
            onChange={handleLinkUpdate}
            placeholder="Paste your link to compress..."
            className="link-field"
            disabled={isCompressing}
          />
          {!linkText && <small className="hint">Enter a valid link</small>}
        </div>
        <button
          type="button"
          onClick={compressLink}
          className="compress-action"
          disabled={isCompressing}
        >
          {isCompressing ? (
            <ScaleLoader
              color="#fff"
              cssOverride={loaderStyle}
              height={15}
              width={4}
              aria-label="Compressing"
            />
          ) : (
            "Compress Link"
          )}
        </button>
      </form>
    </section>
  );
}

export default LinkCompressor;
