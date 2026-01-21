import ai from "../assets/ai.jpg";
import alien from "../assets/alien.jpg";
import cake from "../assets/cake.jpg";
import elephant from "../assets/elephant.jpg";
import moon from "../assets/moon.jpg";
import pyramid from "../assets/pyramid.jpg";
import fox from "../assets/red-fox.jpg";
import temple from "../assets/temple.jpg";
import ocean from "../assets/ocean.jpg";
import sleep from "../assets/sleep.jpg";
import astronaut from "../assets/astronaut.jpg";
import strangecat from "../assets/strangecat.png";
import death from "../assets/death.jpg";
import jesus from "../assets/jesus.jpg";
import mafia from "../assets/mafia.jpg";
import panda from "../assets/panda.jpg";
import pray from "../assets/pray.jpg";
import woman from "../assets/woman.jpg";
import peacock from "../assets/peacock.jpg";
import mammoth from "../assets/mammoth.png";
import batman from "../assets/batman.jpg";
import cat from "../assets/cat.jpg";
import lake from "../assets/lake.png";
import phoenix from "../assets/phoenix.jpg";
import samurai from "../assets/samurai.png";
import santa from "../assets/santa.jpg";
import skull from "../assets/skull.jpg";
import wallgirl from "../assets/wallgirl.jpg";
import festival from "../assets/festival.jpg";
import mary from "../assets/mary.jpg";
import kingfrog from "../assets/kingfrog.png";
import cathat from "../assets/cathat.png";
import creature from "../assets/creature.jpg";
import black from "../assets/black.jpg";
import baker from "../assets/baker.jpg";
import moses from "../assets/moses.png";
import granny from "../assets/granny.png";
import woman2 from "../assets/woman2.jpg";
import springRolls from "../assets/spring-rolls.jpg";
import panorama from "../assets/panorama.jpg";
import fishing from "../assets/fishing.jpg";
import dust from "../assets/dust.jpg";
import christmas from "../assets/christmas.jpg";
import child from "../assets/child.jpg";
import bear from "../assets/bear.png";
import alien2 from "../assets/alien2.jpg";
import walk from "../assets/walk.jpg";
import war from "../assets/war.png";
import mage from "../assets/mage.jpg";
import club from "../assets/club.jpg";
import spaceship from "../assets/spaceship.jpg";
import joker from "../assets/joker.jpg";
import angels from "../assets/angels.jpg";
import luffy from "../assets/luffy.png";


const cardData = [
  ai,
  alien,
  cake,
  elephant,
  moon,
  pyramid,
  fox,
  temple,
  ocean,
  sleep,
  astronaut,
  strangecat,
  death,
  jesus,
  mafia,
  panda,
  pray,
  woman,
  peacock,
  mammoth,
  batman,
  cat,
  lake,
  phoenix,
  samurai,
  santa,
  skull,
  wallgirl,
  festival,
  mary,
  kingfrog,
  cathat,
  creature,
  black,
  baker,
  moses,
  granny,
  woman2,
  springRolls,
  panorama,
  fishing,
  dust,
  christmas,
  child,
  bear,
  alien2,
  walk,
  war,
  mage,
  club,
  spaceship,
  joker,
  angels,
  luffy,
];
const Showcase = () => {
  return (
    <section className="py-16 w-full flex flex-col items-center px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-black mb-8 text-center">
        Explore What You Can Create
      </h2>

      <div className="overflow-hidden w-full relative max-w-6xl">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-gray-50 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-l from-gray-50 to-transparent" />

        <div className="flex w-fit animate-marquee gap-6">
          {[...cardData, ...cardData].map((img, index) => (
            <div
              key={index}
              className="w-56 md:w-64 h-64 relative shrink-0 rounded-2xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={img}
                alt={`Sketchmind showcase ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 100s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Showcase;
