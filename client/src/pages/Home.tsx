import CTA from "../components/CTA";
import Header from "../components/Header";
import Showcase from "../components/Showcase";
import Steps from "../components/Steps";

function Home() {
  return (
    <div className="mt-10">
      <Header />
      <Steps />
      <Showcase />
      <CTA />
    </div>
  );
}
export default Home;
