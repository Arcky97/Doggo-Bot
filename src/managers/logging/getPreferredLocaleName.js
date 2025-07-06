import { Locale } from "discord.js";

export default (local) => {
  switch (local) {
    case Locale.Bulgarian:
      return 'Bulgairan';
    case Locale.ChineseCN:
      return 'Chinese (CN)';
    case Locale.ChineseTW:
      return 'Chinese (TW)';
    case Locale.Croatian:
      return 'Croatian';
    case Locale.Czech:
      return 'Czech';
    case Locale.Danish:
      return 'Danish';
    case Locale.Dutch:
      return 'Dutch';
    case Locale.EnglishGB:
      return 'English (GB)';
    case Locale.EnglishUS:
      return 'English (US)';
    case Locale.Finnish:
      return 'Finnish';
    case Locale.French:
      return 'French';
    case Locale.German:
      return 'German';
    case Locale.Greek:
      return 'Greek';
    case Locale.Hindi:
      return 'Hindi';
    case Locale.Hungarian:
      return 'Hungarian';
    case Locale.Indonesian:
      return 'Indonesian';
    case Locale.Italian:
      return 'Italian';
    case Locale.Japanese:
      return 'Japanese';
    case Locale.Korean:
      return 'Korean';
    case Locale.Lithuanian:
      return 'Lithuanian';
    case Locale.Norwegian:
      return 'Norwegian';
    case Locale.Polish:
      return 'Polish';
    case Locale.PortugueseBR:
      return 'Portuguese (BR)';
    case Locale.Romanian:
      return 'Romanian';
    case Locale.Russian:
      return 'Russian';
    case Locale.SpanishES:
      return 'Spanish (ES)';
    case Locale.SpanishLATAM:
      return 'Spanish (Lat Am)';
    case Locale.Swedish:
      return 'Swedish';
    case Locale.Thai:
      return 'Thai';
    case Locale.Turkish:
      return 'Turkish';
    case Locale.Ukrainian:
      return 'Ukrainian';
    case Locale.Vietnamese:
      return 'Vietnamese';
    default: 
      return 'Unknown Preferred Locale.'
  }
}