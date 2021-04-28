/*
Author: Sergio Cosman Agraz
*/

"use strict";

require("dotenv").config();

const Discord = require("discord.js");
const Fs = require("fs");

const client = new Discord.Client();
const prefix = "!";
const factzSource = "./factz.txt";

// read entire file into string
const contents = Fs.readFileSync(factzSource, "utf8");
const factz = contents.split(/\r\n\s\n/);
const range = factz.length;

//pick random fact and send as message

client.on("message", async message => {

    // constraints
    if ( message.author.bot || !message.content.startsWith(prefix) ) { return };

    //parse message
    const command = message.content.slice(prefix.length);

    // response to `!factz` command
    if ( command === "factz" )
    {
        let randomInt = Math.floor(Math.random() * 10 ) % range;
        message.channel.send( factz[randomInt] );
    };

    // response to `!addfact` command
    if ( command === "addfact")
    {
        let fetchedMsgs = await message.channel.messages.fetch( {limit: 2} );
        let msgArray = JSON.stringify(fetchedMsgs);
        let parsedArray = JSON.parse( msgArray );

        const newFactz = parsedArray[1].content;

        Fs.appendFile(factzSource, `\n\n${newFactz}`, (err) => { if (err) throw err; } );
        message.channel.send( `Added:\n\`\`${newFactz}\`\`\nto factz!` );
    }
});

client.login(process.env.BOT_TOKEN);