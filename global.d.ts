// This file is for VS Code only and needs to stay open 
// in order for VS Code to recognize it as a global variable
import { Client } from 'discord.js';

declare global {
  var client: Client;
}