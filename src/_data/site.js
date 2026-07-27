module.exports = {
  name: "Company Name",
  legalName: "Company Name, LLC",
  shortName: "Company",
  description: "Professional services for growing organizations.",
  currentYear: new Date().getFullYear(),

  url: "https://example.com",

  language: "en",
  locale: "en_US",

  themeColor: "#1f2937",
  favicon: "/public/favicon/favicon.ico",

  ogImage: "/public/images/social-preview.png",
  ogImageAlt: `${this.name} logo on a branded background`,

  navigation: [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about/' },
    { label: 'Services', url: '/services/' },
    { label: 'Contact', url: '/contact/' },
  ],
  
  contact: {
    email: "hello@example.com",
    phoneDisplay: "(555) 555-5555",
    phoneLink: "+15555555555",
  },

  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
  },

  cta: {
    label: "Schedule a Consultation",
    url: "/contact/",
  },
};