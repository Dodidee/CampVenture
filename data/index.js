const mongoose = require('mongoose');
const Campground = require('../model/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
// const API = require('./Unsplash');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log('Mongo Connection open!')
    })
    .catch(err => {
        console.log('Oh No! Mongo Connection Error')
        console.log('Error: ', err)
    })

const requestURL = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=campground&per_page=30`;
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 10; i++) {
        let randomImage1 = await getRandomImage();
        let randomImage2 = await getRandomImage();
        let randomImage3 = await getRandomImage();
        const c = new Campground({
            author: '665dedac2efb451ec316b038',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[i].city}, ${cities[i].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[i].longitude, cities[i].latitude]
            },
            image: [
                {
                    url: randomImage1.urls.regular,
                    filename: randomImage1.slug,
                    originalname: randomImage1.alt_description
                },
                {
                    url: randomImage2.urls.regular,
                    filename: randomImage2.slug,
                    originalname: randomImage2.alt_description
                },
                {
                    url: randomImage3.urls.regular,
                    filename: randomImage3.slug,
                    originalname: randomImage3.alt_description
                }
            ],
            price: Math.floor(Math.random() * 20) + 10,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, voluptate. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam .'
        });
        await c.save();
    }
}

let count = 0;
const getRandomImage = async () => {
    const response = await fetch(requestURL);
    const data = await response.json();
    // console.log(data.results.length);
    // let randomNumber = Math.floor(Math.random() * (data.results.length - 1));
    const results = data.results[count];
    count++;
    return results;
}

// seedDB();