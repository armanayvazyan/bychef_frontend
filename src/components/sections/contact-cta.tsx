import Button from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { fetchApi } from "@/hooks/use-fetch-data";

interface ContactCtaProps {
  className?: string;
}

const ContactCta: React.FC<ContactCtaProps> = ({ className }) => {
  const { t } = useTranslation("translation", { keyPrefix: "partners-page" });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const isFormValid = useMemo(() => {
    return formData.fullName.trim() !== "" && formData.phoneNumber.trim() !== "";
  }, [formData.fullName, formData.phoneNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const { error } = await fetchApi({
        initialPath: "waitlist",
        method: "POST",
        bodyParams: formData,
        hasAT: false,
      });

      if (!error) {
        setSubmitStatus("success");
        setFormData({ fullName: "", phoneNumber: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn("py-16 bg-gray-50", className)} aria-labelledby="contact-title">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 id="contact-title" className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("contact.join-today")}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t("contact.subtitle")}
        </p>

        {submitStatus === "success" ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-md w-full text-center">
            {t("contact.success")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md w-full">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 mb-2">
                {t("contact.name")}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("contact.namePlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                {t("contact.phone")}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t("contact.phonePlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full px-8 py-2 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              size="lg"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? t("contact.submitting") : t("contact.btn")}
            </Button>

            {submitStatus === "error" && (
              <p className="mt-2 text-red-500 text-sm text-center">
                {t("contact.error")}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactCta;