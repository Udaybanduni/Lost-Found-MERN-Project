const Item = require("../models/Item");

// CREATE ITEM
exports.createItem = async (req, res) => {
    try {
        const item = await Item.create({
            ...req.body,
            user: req.user
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL ITEMS
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate("user", "name email");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ITEM BY ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE ITEM
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // CHECK OWNER
        if (item.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE ITEM
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // CHECK OWNER
        if (item.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await item.deleteOne();

        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH ITEM
exports.searchItems = async (req, res) => {
    try {
        const keyword = req.query.name;

        const items = await Item.find({
            itemName: { $regex: keyword, $options: "i" }
        });

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};