const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EC4899', // Pink
        secondary: '#8B5CF6', // Purple
      }
    }
  },
  plugins: {
    "@tailwindcss/postcss": {},



  },
};

export default config;

