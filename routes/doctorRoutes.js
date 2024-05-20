const express = require('express')
const doctorAuthMiddleware = require('../middlewares/doctorAuthMiddleware')
const { doctorLoginController, 
    doctorAuthController, 
    getTodayAppointmentsController,
    getPatientsByIdController
} = require('../controllers/doctorCtrl')

const router = express.Router()

router.post('/doctor-login', doctorLoginController);

router.post('/getDoctorData', doctorAuthMiddleware, doctorAuthController);

router.post('/getTodayAppointments', doctorAuthMiddleware, getTodayAppointmentsController);

router.post('/getPatientsById', doctorAuthMiddleware, getPatientsByIdController);



module.exports = router;