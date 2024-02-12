require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING);

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            drop table if exists cities;
            drop table if exists countries;

            create table countries (
                country_id serial primary key,
                name varchar
            );

            CREATE TABLE cities (
                city_id serial primary key,
                name VARCHAR,
                rating INTEGER,
                country_id INTEGER NOT NULL REFERENCES countries(country_id)
            );

            insert into countries (name)
            values ('Afghanistan'),
            ('Albania'),
            ('Algeria'),
            ('Andorra'),
            ('Angola'),
            ('Antigua and Barbuda'),
            ('Argentina'),
            ('Armenia'),
            ('Australia'),
            ('Austria'),
            ('Azerbaijan'),
            ('Bahamas'),
            ('Bahrain'),
            ('Bangladesh'),
            ('Barbados'),
            ('Belarus'),
            ('Belgium'),
            ('Belize'),
            ('Benin'),
            ('Bhutan'),
            ('Bolivia'),
            ('Bosnia and Herzegovina'),
            ('Botswana'),
            ('Brazil'),
            ('Brunei'),
            ('Bulgaria'),
            ('Burkina Faso'),
            ('Burundi'),
            ('Côte d''Ivoire'),
            ('Cabo Verde'),
            ('Cambodia'),
            ('Cameroon'),
            ('Canada'),
            ('Central African Republic'),
            ('Chad'),
            ('Chile'),
            ('China'),
            ('Colombia'),
            ('Comoros'),
            ('Congo'),
            ('Costa Rica'),
            ('Croatia'),
            ('Cuba'),
            ('Cyprus'),
            ('Czech Republic'),
            ('Democratic Republic of the Congo'),
            ('Denmark'),
            ('Djibouti'),
            ('Dominica'),
            ('Dominican Republic'),
            ('Ecuador'),
            ('Egypt'),
            ('El Salvador'),
            ('Equatorial Guinea'),
            ('Eritrea'),
            ('Estonia'),
            ('Eswatini'),
            ('Ethiopia'),
            ('Fiji'),
            ('Finland'),
            ('France'),
            ('Gabon'),
            ('Gambia'),
            ('Georgia'),
            ('Germany'),
            ('Ghana'),
            ('Greece'),
            ('Grenada'),
            ('Guatemala'),
            ('Guinea'),
            ('Guinea-Bissau'),
            ('Guyana'),
            ('Haiti'),
            ('Holy See'),
            ('Honduras'),
            ('Hungary'),
            ('Iceland'),
            ('India'),
            ('Indonesia'),
            ('Iran'),
            ('Iraq'),
            ('Ireland'),
            ('Israel'),
            ('Italy'),
            ('Jamaica'),
            ('Japan'),
            ('Jordan'),
            ('Kazakhstan'),
            ('Kenya'),
            ('Kiribati'),
            ('Kuwait'),
            ('Kyrgyzstan'),
            ('Laos'),
            ('Latvia'),
            ('Lebanon'),
            ('Lesotho'),
            ('Liberia'),
            ('Libya'),
            ('Liechtenstein'),
            ('Lithuania'),
            ('Luxembourg'),
            ('Madagascar'),
            ('Malawi'),
            ('Malaysia'),
            ('Maldives'),
            ('Mali'),
            ('Malta'),
            ('Marshall Islands'),
            ('Mauritania'),
            ('Mauritius'),
            ('Mexico'),
            ('Micronesia'),
            ('Moldova'),
            ('Monaco'),
            ('Mongolia'),
            ('Montenegro'),
            ('Morocco'),
            ('Mozambique'),
            ('Myanmar'),
            ('Namibia'),
            ('Nauru'),
            ('Nepal'),
            ('Netherlands'),
            ('New Zealand'),
            ('Nicaragua'),
            ('Niger'),
            ('Nigeria'),
            ('North Korea'),
            ('North Macedonia'),
            ('Norway'),
            ('Oman'),
            ('Pakistan'),
            ('Palau'),
            ('Palestine State'),
            ('Panama'),
            ('Papua New Guinea'),
            ('Paraguay'),
            ('Peru'),
            ('Philippines'),
            ('Poland'),
            ('Portugal'),
            ('Qatar'),
            ('Romania'),
            ('Russia'),
            ('Rwanda'),
            ('Saint Kitts and Nevis'),
            ('Saint Lucia'),
            ('Saint Vincent and the Grenadines'),
            ('Samoa'),
            ('San Marino'),
            ('Sao Tome and Principe'),
            ('Saudi Arabia'),
            ('Senegal'),
            ('Serbia'),
            ('Seychelles'),
            ('Sierra Leone'),
            ('Singapore'),
            ('Slovakia'),
            ('Slovenia'),
            ('Solomon Islands'),
            ('Somalia'),
            ('South Africa'),
            ('South Korea'),
            ('South Sudan'),
            ('Spain'),
            ('Sri Lanka'),
            ('Sudan'),
            ('Suriname'),
            ('Sweden'),
            ('Switzerland'),
            ('Syria'),
            ('Taiwan'),
            ('Tajikistan'),
            ('Tanzania'),
            ('Thailand'),
            ('Timor-Leste'),
            ('Togo'),
            ('Tonga'),
            ('Trinidad and Tobago'),
            ('Tunisia'),
            ('Turkey'),
            ('Turkmenistan'),
            ('Tuvalu'),
            ('Uganda'),
            ('Ukraine'),
            ('United Arab Emirates'),
            ('United Kingdom'),
            ('United States of America'),
            ('Uruguay'),
            ('Uzbekistan'),
            ('Vanuatu'),
            ('Venezuela'),
            ('Vietnam'),
            ('Yemen'),
            ('Zambia'),
            ('Zimbabwe')
            ;
            
            INSERT INTO cities (name, rating, country_id)
            VALUES 
                  ('Taipei', 5, (SELECT country_id FROM countries WHERE name = 'Taiwan'))
                , ('Tainan', 4, (SELECT country_id FROM countries WHERE name = 'Taiwan'))
                , ('Tokyo', 4, (SELECT country_id FROM countries WHERE name = 'Japan'))
                , ('Kyoto', 5, (SELECT country_id FROM countries WHERE name = 'Japan'))
                , ('Boracay', 5, (SELECT country_id FROM countries WHERE name = 'Philippines'))
                , ('El Nido', 5, (SELECT country_id FROM countries WHERE name = 'Philippines'))
            ;
            `
        ).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },
    getCountries: (req, res) => {
        const query =  
            `
            SELECT *
            FROM countries;
            `

        sequelize.query(query)
            .then((dbRes) => {
                console.log('populated countries drop down');
                res.status(200).send(dbRes[0])
            }).catch(err => console.log('error retrieving countries', err))
    },
    createCity: (req,res) => {
        console.log(req.body)
        const{ name, rating, countryId:country_id } = req.body;

        const query = 
            `
            INSERT INTO cities (name, rating, country_id)
            VALUES ('${name}', ${rating}, ${country_id})
            ;
            `
        
        sequelize.query(query)
            .then((dbRes) => {
                // console.log(`${country_id}`);
                res.status(200).send('Success')
            }).catch(err => console.log('error adding city', err))
    },
    getCities: (req, res) => {
        const query =
            `
            SELECT
                t1.city_id
                , t1."name"		 AS city_name
                , t1.country_id
                , t2."name"		 AS country_name
                , t1.rating

            FROM cities 		 t1
            INNER JOIN countries t2
                ON t2.country_id = t1.country_id
            ORDER BY t1.rating DESC
            ;
            `

        sequelize.query(query)
            .then((dbRes) => {
                console.log(dbRes[0]);
                res.status(200).send(dbRes[0]);
            }).catch(err => console.log('error retrieving cities', err))
    },
    deleteCity: (req,res) => {
        const { id } = req.params;

        const query = 
            `
            DELETE
            FROM cities
            WHERE city_id = ${id}
            ;
            `
        
        sequelize.query(query)
            .then((dbRes) => {
                console.log(`deleted city id: ${id}`)
                res.status(200).send(dbRes[0])
            }).catch(err => console.log('error deleting city', err))


    }
}