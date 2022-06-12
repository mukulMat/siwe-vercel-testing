import mongoose from "mongoose";
const schema = mongoose.Schema;

const siweSchema = schema({
  nonce: String,
  fields: { type: schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const siweModel = mongoose.model("siwes", siweSchema);
export default siweModel;
