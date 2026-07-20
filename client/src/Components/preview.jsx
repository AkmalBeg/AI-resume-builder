import React from "react";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";

const Preview = ({
  data,
  template,
  accentColor,
  classes = "",
}) => {
  const getTemplate = () => {
    switch (template) {
      case "modern":
        return (
          <ModernTemplate
            data={data}
            accentColor={accentColor}
          />
        );

      case "minimal":
        return (
          <MinimalTemplate
            data={data}
            accentColor={accentColor}
          />
        );

      case "minimal-image":
        return (
          <MinimalImageTemplate
            data={data}
            accentColor={accentColor}
          />
        );

      default:
        return (
          <ClassicTemplate
            data={data}
            accentColor={accentColor}
          />
        );
    }
  };

  return (
    <div className="w-full bg-gray-100 p-6">
      <div
        id="resume-preview"
        className={`w-[816px] min-h-[1056px] mx-auto bg-white border border-gray-200 shadow-lg overflow-hidden print:shadow-none print:border-none ${classes}`}
      >
        {getTemplate()}
      </div>

      <style>
        {`
          @page {
            size: Letter;
            margin: 0;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #f3f4f6;
          }

          #resume-preview {
            font-family: Arial, Helvetica, sans-serif;
          }

          @media print {
            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            #resume-preview {
              width: 8.5in;
              min-height: 11in;
              margin: 0;
              padding: 0;
              border: none !important;
              box-shadow: none !important;
              background: white;
              overflow: hidden;
            }

            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            button,
            nav,
            header,
            footer,
            .no-print {
              display: none !important;
            }

            img {
              max-width: 100%;
              page-break-inside: avoid;
            }

            table,
            section,
            p,
            li,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              page-break-inside: avoid;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              page-break-after: avoid;
            }

            ul,
            ol {
              margin: 0;
              padding-left: 18px;
            }

            textarea,
            input {
              border: none;
              outline: none;
              background: transparent;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Preview;
