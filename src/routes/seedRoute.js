/**
 * Route seed
 * @description Redirect request from /seeds to the proper controller call
 */

const express = require('express');
const seed = express();

const SeedController = require('../controllers/seedController');
const SeedCtrl = new SeedController();
// Interacts with the patients in the DB

seed.route('/')
    .get(SeedCtrl.getSeedList);

seed.route('/:target')
    .get(SeedCtrl.getSeed)
    .post(SeedCtrl.createSeed)
    .put(SeedCtrl.editSeed)
    .delete(SeedCtrl.deleteSeed);

module.exports = seed;
