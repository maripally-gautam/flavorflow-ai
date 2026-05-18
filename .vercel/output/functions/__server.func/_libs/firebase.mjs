import "./firebase__auth.mjs";
import { r as registerVersion } from "./firebase__app.mjs";
import "./firebase__logger.mjs";
import "./firebase__firestore.mjs";
import "./firebase__storage.mjs";
import "./firebase__messaging.mjs";
var name = "firebase";
var version = "12.13.0";
registerVersion(name, version, "app");
