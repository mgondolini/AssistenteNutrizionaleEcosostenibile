/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const SingleMeal = mongoose.model('SingleMeal');
const Meals = mongoose.model('Meals');
const Products = mongoose.model('Product');


/* Inits meal values to 0 */
exports.initMealValues = (mealName) => {
  console.log('init meal values');
  const mealToAdd = new SingleMeal(); // SingleMeal compone l'array meals di UserMealSchema
  mealToAdd.meal_name = mealName;
  mealToAdd.components = [{}];
  mealToAdd.energy_tot = 0;
  mealToAdd.carbohydrates_tot = 0;
  mealToAdd.sugars_tot = 0;
  mealToAdd.fat_tot = 0;
  mealToAdd.saturated_fat_tot = 0;
  mealToAdd.proteins_tot = 0;
  mealToAdd.fiber_tot = 0;
  mealToAdd.salt_tot = 0;
  mealToAdd.sodium_tot = 0;
  mealToAdd.alcohol_tot = 0;
  mealToAdd.calcium_tot = 0;
  mealToAdd.carbon_footprint_tot = 0;
  mealToAdd.water_footprint_tot = 0;
  mealToAdd.timestamp = new Date();
  return mealToAdd;
};

/* Add meal to meals array of a user */
exports.addMeal = (req, userMeals, res) => {
  let mealToAdd;
  let exists = false;
  const { mealName } = req.body.meals;
  const updateMeal = new Meals(userMeals);

  // controllo se ci sono pasti per lo stesso utente con lo stesso nome che voglio inserire
  userMeals.meals.forEach((m) => {
    console.log(m.meal_name === mealName); // DEBUG
    if (m.meal_name === mealName) exists = true;
  });

  // se non ci sono pasti con lo stesso nome inizializzo il pasto da inserire
  if (exists === false) {
    mealToAdd = this.initMealValues(mealName);
    console.log(`Meal to add ${mealToAdd}`); // DEBUG
  }

  // se mealToAdd è nullo vuol dire che c'era già un pasto con il nome inserito
  // quindi invio un messaggio di errore 400 BAD REQUEST
  if (mealToAdd != null) {
    updateMeal.meals.push(mealToAdd);
    updateMeal.save()
      .then((meal) => {
        console.log(`meal updated -> ${meal}`); // DEBUG
        res.status(201).json(meal);
      })
      .catch((err) => {
        console.log('error while updating new meal'); // DEBUG
        res.send(err);
      });
  } else {
    res.status(400).json({ description: 'Meal name already in use.' });
  }
};


/* Creates the first meal of a user */
exports.createFirstMeal = (req, res) => {
  const { username } = req.body;
  const { mealName } = req.body.meals;

  const newMeal = new Meals();
  newMeal.username = username;

  const mealToAdd = this.initMealValues(mealName);
  newMeal.meals.push(mealToAdd);

  newMeal.save()
    .then((meal) => {
      console.log(`meal created -> ${meal}`); // DEBUG
      res.status(201).json(meal);
    })
    .catch((err) => {
      console.log('error while creating new meal'); // DEBUG
      res.send(err);
    });
};


/* Computes value in grams for a portion of a given quantity */
exports.computeValuePerPortion = (value, quantity) => ((value / 100) * quantity);


/* Checks the value before compute the expression */
exports.valuePerPortion = (value, quantity) => {
  let valuePerQuantity;

  if (value != null) valuePerQuantity = this.computeValuePerPortion(value, quantity);
  else valuePerQuantity = 0;

  return valuePerQuantity;
};


/* Computes values for a meal */
exports.computeMealValues = async (barcode, quantity, res) => {
  let productName;
  let imageUrl;
  let energyTot;
  let carbsTot;
  let sugarsTot;
  let fatTot;
  let saturatedFatTot;
  let proteinsTot;
  let fiberTot;
  let saltTot;
  let sodiumTot;
  let alcoholTot;
  let calciumTot;
  let carbonFootprintTot;
  let waterFootprintTot;

  const query = { code: barcode };

  await Products.findOne(query)
    .exec()
    .then((product) => {
      productName = product.product_name;
      imageUrl = product.image_url;
      energyTot = this.valuePerPortion(product.energy_100g, quantity);
      carbsTot = this.valuePerPortion(product.carbohydrates_100g, quantity);
      sugarsTot = this.valuePerPortion(product.sugars_100g, quantity);
      fatTot = this.valuePerPortion(product.fat_100g, quantity);
      saturatedFatTot = this.valuePerPortion(product.saturated_fat_100g, quantity);
      proteinsTot = this.valuePerPortion(product.proteins_100g, quantity);
      fiberTot = this.valuePerPortion(product.fiber_100g, quantity);
      saltTot = this.valuePerPortion(product.salt_100g, quantity);
      sodiumTot = this.valuePerPortion(product.sodium_100g, quantity);
      alcoholTot = this.valuePerPortion(product.alcohol_100g, quantity);
      calciumTot = this.valuePerPortion(product.calcium_100g, quantity);
      carbonFootprintTot = this.valuePerPortion(product.carbon_footprint_100g, quantity);
      waterFootprintTot = this.valuePerPortion(product.water_footprint_100g, quantity);
    })
    .catch((err) => res.send(err));

  const values = {
    product_name: productName,
    image_url: imageUrl,
    energy_tot: energyTot,
    carbohidrates_tot: carbsTot,
    sugars_tot: sugarsTot,
    fat_tot: fatTot,
    saturated_fat_tot: saturatedFatTot,
    proteins_tot: proteinsTot,
    salt_tot: saltTot,
    sodium_tot: sodiumTot,
    calcium_tot: calciumTot,
    alcohol_tot: alcoholTot,
    fiber_tot: fiberTot,
    carbon_footprint_tot: carbonFootprintTot,
    water_footprint_tot: waterFootprintTot,
  };
  console.log(`VALUES -> ${JSON.stringify(values)}`); // DEBUG

  return values;
};


/* Update meal values after inserting a new component */
exports.updateMealValues = async (components, mealName, userMeals, res) => {
  const { barcode } = components;
  const { quantity } = components;

  this.computeMealValues(barcode, quantity, res)
    .then((values) => {
      userMeals.meals.forEach((meal) => {
        if (meal.meal_name === mealName) {
          // Meal schema field update
          meal.energy_tot += values.energy_tot;
          meal.carbohidrates_tot += values.carbohidrates_tot;
          meal.sugars_tot += values.sugars_tot;
          meal.fat_tot += values.fat_tot;
          meal.saturated_fat_tot += values.saturated_fat_tot;
          meal.proteins_tot += values.proteins_tot;
          meal.salt_tot += values.salt_tot;
          meal.sodium_tot += values.sodium_tot;
          meal.calcium_tot += values.calcium_tot;
          meal.alcohol_tot += values.alcohol_tot;
          meal.fiber_tot += values.fiber_tot;
          meal.carbon_footprint_tot += values.carbon_footprint_tot;
          meal.water_footprint_tot += values.water_footprint_tot;

          // Components schema field update
          components.product_name = values.product_name;
          components.image_url = values.image_url;

          console.log(`components: ${components}`); // DEBUG
          meal.components.push(components);
        }
      });
      userMeals.save()
        .then((meals) => res.status(201).json(meals))
        .catch((err) => res.send(err));
    });
};
