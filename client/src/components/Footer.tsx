const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-6 flex flex-col items-center text-center">
      <p className="text-sm">&copy; {year} Sketchmind. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
