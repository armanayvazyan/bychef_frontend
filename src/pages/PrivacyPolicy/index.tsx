import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    (async function() {
      try {
        const response = await fetch(`https://static.bychef.am/docs/privacy/${i18n.language}_latest.html`);

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const html = await response.text();

        setContent(html);
      } catch(error) {
        console.log(error);
      }
    })();
  }, [i18n.language]);

  return (
    <section className="px-[10%] py-20">
      <div className="leading-loose [&_li]:ms-3" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default PrivacyPolicy;