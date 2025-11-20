export default function VideoPlayer(content) {
    return `
        <div class="aspect-w-16 aspect-h-9">
            <iframe
                src="${content.source}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full h-full rounded-lg"
            ></iframe>
        </div>
    `;
}