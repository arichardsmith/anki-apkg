# anki-apkg

anki-apkg is highly inspired by [anki-apkg-export](https://github.com/repeat-space/anki-apkg-export/) and works almost the same, then why a new package?

Because I'm not satisfied with only creating `{{front}}` and `{{back}}` field for a card, this package is created to make it possible to customize fields (and any other variables of a deck or card in the future).

```
npm install anki-apkg
```

```js
const { APKG } = require('anki-apkg')

const apkg = new APKG({
    name: 'VocabularyBuilder',
    card: {
        fields: ['word', 'meaning', 'usage'],
        template: {
            question: '{{word}}',
            answer: `
              <div class="word">{{word}}</div>
              <div class="meaning">{{meaning}}</div>
              <div class="usage">{{usage}}</div>
            `
        },
        styleText: '.card { text-align: center; }'
    }
})
apkg.addCard({
    timestamp: +new Date(), // create time
    content: ['sample word', 'sample meaning', 'sample usage'], // keep the order same as `fields` defined above
    tags: ['unicorn', 'some tag'] // tags are kebab-cased as spaces are not supported (another tag becomes another-tag)
})
// content can also be added as an object where the keys match the card fields
apkg.addCard({
    content: {
        word: 'another sample',
        usage: 'sample usage',
        meaning: 'sample meaning'
    }
})
apkg.save(__dirname)
```

## `addMedia(filename: string, data: Buffer)`
Adds media files to package. You can reference `filename` in cards and templates. For example.
```js
apkg.addMedia('unicorn.gif', readFileSync(join(__dirname, 'media/unicorn.gif')))

apkg.addCard({
    content: ['No unicorn', 'Unicorn <img src="unicorn.gif" />']
})
```

## `generateStream()`
Generates a package and returns a readable stream

## Templates
`config.card.template` can also be an array of templates to create multiple cards per note
