import pkg from 'nayan-media-downloader';
const { tikdown, ndown } = pkg;
export async function tiktok(url) {
    try {
        let result = await tikdown(url)
        return { title: result.data.title, video: result.data.video, audio: result.data.audio }
    } catch (error) {
        return error
    }
}
export async function meta(url) {
    try {
        let result = await ndown(url)
        return result.data[0].url
    } catch (error) {
        return error
    }
}

// console.log(await meta("https://www.instagram.com/reel/C81uiueJ4ho/?utm_source=ig_web_copy_link"))