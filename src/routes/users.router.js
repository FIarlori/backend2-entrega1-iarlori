const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: null
        });

        await user.save();
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('cart');
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { password, ...updates } = req.body;
        if (password) {
            updates.password = bcrypt.hashSync(password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;