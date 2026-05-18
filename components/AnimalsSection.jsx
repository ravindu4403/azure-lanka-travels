const animals = [
  {
    name: 'Asian Elephant',
    img: '/images/animals/elephant.png',
    text: `The Sri Lankan elephant (Elephas maximus maximus) is the largest and darkest of the Asian elephant subspecies. It is easily recognized by its distinctively smaller ears compared to its African cousins and patches of depigmentation, or freckles, on its ears, face, and trunk. As massive herbivores, they consume up to 300 pounds of food a day, consisting of grasses, tree bark, roots, and leaves. These endangered gentle giants primarily inhabit the broadleaf forests, scrublands, and grasslands of Sri Lanka's dry zones. Interestingly, only a small percentage of male Sri Lankan elephants, known as tuskers, actually grow tusks, making them an incredibly rare and majestic sight in the wild.`,
    align: 'right',
  },
  {
    name: 'Sri Lankan Leopard',
    img: '/images/animals/leopard.png',
    text: `As the apex predator of the island, the Sri Lankan leopard (Panthera pardus kotiya) roams entirely without competition from larger cats like lions or tigers. They are revered for their striking tawny or rusty yellow coats dotted with dark rosettes. These carnivorous and highly adaptable hunters prey on a wide variety of animals, from spotted deer and wild boar to monkeys and reptiles. Their habitat ranges extensively, covering everything from the dense, evergreen rainforests in the wet zone to the scrub jungles of the dry zone, such as Yala National Park. Because they are the undisputed top predators in their ecosystem, they are more frequently seen prowling confidently on the ground during the day compared to their African counterparts, though they unfortunately remain a vulnerable species.`,
    align: 'left',
  },
  {
    name: 'Sri Lankan Sloth Bear',
    img: '/images/animals/sloth-bear.png',
    text: `The Sri Lankan sloth bear (Melursus ursinus inornatus) is a unique, shaggy-coated bear recognized by a distinctive white 'V' or 'Y' shaped mark on its chest. They are equipped with long, curved claws and a specially adapted lower lip and palate perfectly designed for sucking up insects. While technically omnivorous, their diet is highly specialized; they primarily feast on termites and ants but also heavily rely on seasonal fruits, berries, and honey found in their lowland dry forest and scrub habitats. When feeding on a termite mound, they close their nostrils to prevent insects from crawling inside and use their lips like a vacuum cleaner, creating a remarkably loud sucking noise that echoes through the forest. They are currently listed as a vulnerable species.`,
    align: 'right',
  },
  {
    name: 'Sri Lankan Spotted Deer (Chital)',
    img: '/images/animals/deer.png',
    text: `The Sri Lankan spotted deer, also known as chital, is one of the most graceful and commonly sighted animals in Yala. Their warm brown coats covered with bright white spots help them blend into open grasslands and light forest. They often move in herds, grazing near waterholes and staying alert for signs of leopards. Their calls and movements are important clues for safari guides, because sudden alarm calls can reveal the presence of a predator nearby. Beautiful, gentle, and highly active during safari hours, spotted deer bring life and movement to the park's wilderness scenery.`,
    align: 'left',
  },
  {
    name: 'Crocodile',
    img: '/images/animals/crocodile.png',
    text: `The mugger crocodile (Crocodylus palustris) is a broad-snouted aquatic reptile that boasts a distinctly prehistoric appearance with its heavy armor of thick scutes. They are incredibly powerful swimmers and stealthy ambush predators, patiently waiting to snap up fish, amphibians, birds, and mammals that come to the water's edge to drink. Their preferred habitats include freshwater environments like slow-moving rivers, lakes, and the ancient man-made irrigation reservoirs, known locally as tanks, spread across Sri Lanka. During extreme droughts, these vulnerable crocodiles display an incredible survival trait by digging deep burrows in the mud to keep cool and estivate—a state of dormancy similar to hibernation—until the monsoonal rains finally return.`,
    align: 'right',
  },
];

export default function AnimalsSection() {
  return (
    <section className="section animals-section figma-page">
      <span className="small-label right-label">Wildlife of Yala</span>
      <h2 className="center-title">Animals You May Encounter</h2>
      <p className="section-intro center-intro">
        Yala National Park is one of the world's best places to observe leopards in the wild, and also home to an extraordinary variety of other mammals, reptiles, and birds. Every safari brings the possibility of something rare and unforgettable.
      </p>
      <div className="animal-story-list">
        {animals.map((animal) => {
          const slug = animal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
          <article className={`animal-story ${animal.align} animal-${slug}`} key={animal.name}>
            <div className="animal-image-wrap">
              <img src={animal.img} alt={animal.name} />
            </div>
            <div className="animal-text">
              <h3>{animal.name}</h3>
              <p>{animal.text}</p>
            </div>
          </article>
          );
        })}
      </div>
      <p className="wildlife-note">
        Beyond the iconic animals listed above, Yala National Park serves as a vibrant sanctuary for a staggering variety of other wildlife and birdlife, making it an essential destination for any nature enthusiast. As one of Sri Lanka's premier Important Bird Areas, the park is home to over 215 bird species, including seven endemics like the Sri Lanka grey hornbill and the Sri Lanka junglefowl. Visitors can witness a kaleidoscope of colors in the park's lagoons and forests, where majestic raptors like the white-bellied sea eagle soar above, and rare residents like the black-necked stork and lesser adjutant wade through the wetlands alongside thousands of migratory waterfowl. On the ground, the diverse landscape shelters 44 mammal species, including wild water buffalo, golden palm civets, and the rare red slender loris. Whether you are scouting the lagoons for spot-billed pelicans or tracking elusive mammals through the scrub, Yala offers an unparalleled safari experience where every turn reveals a new wonder of the natural world.
      </p>
    </section>
  );
}
