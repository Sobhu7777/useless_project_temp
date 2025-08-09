import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Intro() {
  return (
    <div className="bg-base-100 text-base-content min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <div className="flex-1">
          <span className="text-2xl font-bold">🌴 Kerala Thattukada</span>
        </div>
        <div className="flex-none gap-4">
          <a href="#about" className="btn btn-ghost">
            About
          </a>
          <a href="#how" className="btn btn-ghost">
            How It Works
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="hero min-h-[80vh] bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <motion.img
            src="../../public/6871005.jpg"
            className="max-w-sm rounded-2xl shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-primary-content">
              Nadan Food AI powered
            </h1>
            <p className="py-6 max-w-lg">
              Mone, you know how it is. You stand by the thatukada counter, and
              the chettan just knows what to give you. We've got that same vibe,
              but with kurach tech. Give us a quick click, and our scanner
              will find the snack that's been waiting for you. From kappa
              biriyani to mandi, we've got your mood sorted. It's the thatukada
              experience, machane, but in your hand!
            </p>
            <Link to="/home" className="btn btn-secondary">
              Predict My Food
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        className="px-8 py-16 bg-base-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6">Why Kerala Thattukada?</h2>
        <p className="max-w-2xl">
          Thattukadas are the heartbeat of Kerala's street food culture. We
          blend tradition with AI — predicting your food from just a picture,
          making every bite a journey through Kerala's vibrant flavors.
        </p>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how"
        className="px-8 py-16 bg-gradient-to-r from-yellow-200 via-orange-200 to-amber-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Take or upload a food picture.",
            "AI analyzes your image.",
            "We guess your dish & suggest Kerala flavors.",
          ].map((step, i) => (
            <motion.div
              key={i}
              className="card bg-base-100 shadow-xl p-6 border border-base-300"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-xl mb-2">Step {i + 1}</h3>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
