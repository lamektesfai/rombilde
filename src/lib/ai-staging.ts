const AI_STAGING_BASE_URL = "https://api.decor8.ai";

interface Decor8Image {
  uuid: string;
  width: number;
  height: number;
  url: string;
}

async function callAiStaging<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${AI_STAGING_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AI_STAGING_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`AI staging-kall feilet (${endpoint}): ${data.error || response.status}`);
  }

  return data;
}

export async function removeFurnitureFromImage(imageUrl: string): Promise<string> {
  const result = await callAiStaging<{ info: { image: Decor8Image } }>(
    "/remove_objects_from_room",
    { input_image_url: imageUrl }
  );
  return result.info.image.url;
}

export async function furnishRoomImage(params: {
  imageUrl: string;
  roomType: string;
  style: string;
}): Promise<string> {
  const result = await callAiStaging<{ info: { images: Decor8Image[] } }>(
    "/generate_designs_for_room",
    {
      input_image_url: params.imageUrl,
      room_type: params.roomType,
      design_style: params.style,
      num_images: 1,
    }
  );
  return result.info.images[0].url;
}
