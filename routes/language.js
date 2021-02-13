const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

module.exports = router;
