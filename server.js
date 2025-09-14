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
      gender: attacker.gender,
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
      gender: defender.gender,
      evs: defender.evs,
      ivs: defender.ivs,
      boosts: defender.boosts,
      status: defender.status,
      curHP: defender.curHP
    });

    const mv = new Move(g, typeof move === "string" ? move : move.name, {
      ability: move.ability,
      useZ: move.useZ,
      isCrit: move.isCrit,
      hits: move.hits,
      timesUsed: move.timesUsed,
      isSpread: move.isSpread
    });

    const fld = new Field({
      gameType: field?.gameType,
      weather: field?.weather,
      terrain: field?.terrain,
      isGravity: field?.isGravity,
      attackerSide: field?.attackerSide,
      defenderSide: field?.defenderSide
    });

    const result = calculate(g, atk, def, mv, fld);

    if (!result.damage || result.damage.every(d => d === 0)) {
      return res.json({
        damage: [0],
        desc: "possibly the worst move ever"
      });
    }

    res.json({
      damage: result.damage,
      desc: result.fullDesc()
    });
  } catch (err) {
    res.status(400).json({
      damage: [0],
      desc: "possibly the worst move ever"
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Damage Calc API running on port ${port}`));
