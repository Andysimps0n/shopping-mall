import { Router } from "express";
import { parseAddressBookEntry } from "../lib/address.js";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} from "../lib/addressBook.js";
import { requireUser } from "../lib/requireUser.js";

const router = Router();

router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    res.json({ addresses: await listAddresses(req.userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "address_failed" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = parseAddressBookEntry(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const result = await createAddress(req.userId, parsed.value);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json({ addresses: result.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "address_failed" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const addressId = typeof req.params.id === "string" ? req.params.id : "";
    const parsed = parseAddressBookEntry(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const result = await updateAddress(req.userId, addressId, parsed.value);
    if (result.error) {
      const status = result.error === "not_found" ? 404 : 400;
      res.status(status).json({ error: result.error });
      return;
    }
    res.json({ addresses: result.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "address_failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const addressId = typeof req.params.id === "string" ? req.params.id : "";
    const result = await deleteAddress(req.userId, addressId);
    if (result.error === "not_found") {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ addresses: result.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "address_failed" });
  }
});

export default router;
