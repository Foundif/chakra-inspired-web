import woven from "./woven-label.jpg";
import hangTags from "./hang-tags.jpg";
import cottonPrinted from "./cotton-printed-label.jpg";
import satinPrinted from "./satin-printed-label.jpg";
import heatTransfer from "./heat-transfer.jpg";
import silicon from "./silicon-patch.jpg";
import sticker from "./printed-sticker.jpg";
import packaging from "./packaging-boxes.jpg";

export const productImageMap: Record<string, string> = {
  "woven-labels": woven,
  "hang-tags": hangTags,
  "wash-care-labels": cottonPrinted,
  "taffeta-labels": satinPrinted,
  "printed-labels": heatTransfer,
  "garment-tags": sticker,
  "jeans-labels": silicon,
  "size-labels": packaging,
};

export {
  woven,
  hangTags,
  cottonPrinted,
  satinPrinted,
  heatTransfer,
  silicon,
  sticker,
  packaging,
};
