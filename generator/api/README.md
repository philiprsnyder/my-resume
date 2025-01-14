# Setup

```
npm install
```

Edit `.env` based from `.env.example` file.

```
npm start
```

Browse to [http://localhost:9000](http://localhost:9000) (adjust port accordingly)

#API Endpoints

POST /api/skillset

Saves skillset which is an array of skill definitions.

```
[
  <SkillDefinition>,
  <SkillDefinition>...
]
```

A skill should have this data structure:

```
interface SkillDefinition {
  name: string;
  lvl: number;
  relatesTo?: string[];
}
```

`relatesTo` is an array of strings that are skill names, creating a relation map between skills.