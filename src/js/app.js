import {
  formSubmitBtn,
  selectBtn,
  hiddenFileSelector,
  selectedFilename,
  spinner,
  imagesHolder,
  prompter,
} from './globals/dom.globals'

const onFileInputChange = (e) => {
    if (
      e.target.files[0].type &&
      !e.target.files[0].type.startsWith('image/')
    ) {
      console.log(
        'File is not an image.',
        e.target.files[0].type,
        e.target.files[0]
      )
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      generateImageThumbnail(e.target.result)
    })
    reader.readAsDataURL(e.target.files[0])
    //document.querySelector('.images-holder').appendChild(reader.readAsDataURL(e.target.files[0]))

    selectedFilename.textContent = e.target.files[0].name
  },
  onFileUploadClick = (e) => {
    e.preventDefault()
    hiddenFileSelector.value = ''
    hiddenFileSelector.click()
  },
  disableButtonGenerator = () => {
    formSubmitBtn.classList.remove('bg-teal-500')
    formSubmitBtn.classList.add('bg-neutral-400', 'pointer-events-none')
  },
  enableButtonGenerator = () => {
    formSubmitBtn.classList.remove('bg-neutral-400', 'pointer-events-none')
    formSubmitBtn.classList.add('bg-teal-500')
  },
  onImgLoaded = (e) => {
    e.target.removeEventListener('load', onImgLoaded, false)

    console.log(e.target.parentNode)

    e.target.parentNode.style.backgroundImage = 'url(' + e.target.src + ')'
    e.target.parentNode.classList.add('show')

    e.target.parentNode.removeChild(e.target)

    // console.log(e.target)
    // console.log(e.currentTarget)
  },
  hideSpinner = () => {
    spinner.classList.remove('show')
  },
  showSpinner = () => {
    spinner.classList.add('show')
  },
  generateImageThumbnail = (_src) => {
    const myImgContainer = document.createElement('div')
    myImgContainer.classList.add(
      'mr-[1rem]',
      'mb-[1rem]',
      'border-8',
      'border-transparent',
      'hover:border-8',
      'hover:border-teal-500'
    )

    const myImgHolder = document.createElement('div')
    myImgHolder.classList.add('image-holder')
    myImgContainer.appendChild(myImgHolder)

    const myImg = document.createElement('img')
    myImg.classList.add('hidden')
    myImg.src = _src

    myImgHolder.appendChild(myImg)
    myImg.addEventListener('load', onImgLoaded, false)

    imagesHolder.appendChild(myImgContainer)

    //return myImgContainer
  },
  generateImageRequest = async (prompt, size, number) => {
    try {
      showSpinner()
      const response = await fetch(
        'http://localhost:5000/openai/generateimage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            size,
            number,
          }),
        }
      )

      if (!response.ok) {
        hideSpinner()
        throw new Error('That image could not be generated')
      }

      const data = await response.json()
      enableButtonGenerator()
      hideSpinner()
      data.data.map((_obj) => {
        //document.querySelector('.images-holder').appendChild()
        generateImageThumbnail(_obj)
      })
    } catch (error) {
      document.querySelector('h2.msg').textContent = error
    }
  },
  onSubmit = (e) => {
    e.preventDefault()

    const myPrompt = prompter.value

    if (!myPrompt.length > 0) {
      alert('please add some text')
    } else {
      disableButtonGenerator()
      generateImageRequest(myPrompt, 'medium', 1)
    }
  },
  init = (e) => {
    document.removeEventListener('DOMContentLoaded', init, false)
    formSubmitBtn.addEventListener('click', onSubmit, false)
    selectBtn.addEventListener('click', onFileUploadClick, false)
    hiddenFileSelector.addEventListener('change', onFileInputChange, false)
  }

document.addEventListener('DOMContentLoaded', init, false)
