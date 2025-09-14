import express from "express";
import { calculate, Generations, Pokemon, Move, Field } from "@smogon/calc";

const app = express();
app.use(express.json());

app.post("/calc", (req, res) => {
  try {
    const { gen, attacker, defender, move, field } = req.body;
    const g = Generations.get(Number(gen) || 9);

    const atk = new Pokemon(g, attacker.species, {
      item: attacker.item,
      ability: attacker.ability,
      nature: attacker.nature,
      level: attacker.level,
      evs: attacker.evs,
      ivs: attacker.ivs,
      boosts: attacker.boosts,
      status: attacker.status,
      curHP: attacker.curHP
    });

    const def = new Pokemon(g, defender.species, {
      item: defender.item,
      ability: defender.ability,
      nature: defender.nature,
      level: defender.level,
      evs: defender.evs,
      ivs: defender.ivs,
      boosts: defender.boosts,
      status: defender.status,
      curHP: defender.curHP
    });

    const mv = new Move(g, typeof move === "string" ? move : move.name);

    const fld = new Field(field || {});

    const result = calculate(g, atk, def, mv, fld);

    res.json({
      damage: result.damage,
      desc: result.fullDesc()
    });
  } catch (err) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Damage Calc API running on port ${port}`));
