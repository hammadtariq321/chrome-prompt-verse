
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, style, aspect_ratio } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Enhance prompt based on style
    let enhancedPrompt = prompt
    switch (style) {
      case 'realistic':
        enhancedPrompt = `photorealistic, high quality, detailed, ${prompt}`
        break
      case 'artistic':
        enhancedPrompt = `artistic, creative, beautiful, ${prompt}`
        break
      case 'anime':
        enhancedPrompt = `anime style, manga, Japanese art, ${prompt}`
        break
      case 'cyberpunk':
        enhancedPrompt = `cyberpunk, neon lights, futuristic, sci-fi, ${prompt}`
        break
      case 'fantasy':
        enhancedPrompt = `fantasy art, magical, mystical, ${prompt}`
        break
      case 'abstract':
        enhancedPrompt = `abstract art, artistic, creative, ${prompt}`
        break
      default:
        enhancedPrompt = prompt
    }

    console.log('Generating image with prompt:', enhancedPrompt)

    const image = await hf.textToImage({
      inputs: enhancedPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        prompt: enhancedPrompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
