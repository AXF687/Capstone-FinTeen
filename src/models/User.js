const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ["pelajar", "mahasiswa", "pekerja"],
        },
        pemasukan_bulanan: {
            type: Number,
            min: 0,
            default: 0,
        },
        target_bulanan: {
            type: Number,
            min: 0,
            default: 0,
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        nama: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        is_verified: {
            type: Boolean,
            default: false
        },
        currency: {
            type: String,
            default: "IDR"
        },
        goal_utama: {
            type: String
        },
        profil: profileSchema,
        last_login: {
            type: Date
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

module.exports = mongoose.model("User", userSchema);