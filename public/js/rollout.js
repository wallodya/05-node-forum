const moreButtons = [...document.getElementsByClassName('more-button')]
const rollouts = document.getElementsByClassName('content-rollout')
console.log(moreButtons)

const rollout = () => {
    for (let i = 0; i < rollouts.length; i++) {
        // rollouts[i].style.transition = '300ms'
        // rollouts[i].style.display = 'block'
        setTimeout(() => {
            rollouts[i].style.display = 'block'
        }, 1)
    }
    setTimeout(() => {
        for (let i = 0; i < moreButtons.length; i++) {
            moreButtons[i].innerText = 'LESS'
            moreButtons[i].onclick = () => {
                setTimeout(() => {rollin()}, 1)
            }
        }
    }, 300)
}

const rollin = () => {
    for (let i = 0; i < rollouts.length; i++) {
        // rollouts[i].style.transition = '300ms'
        // rollouts[i].style.display = 'none'
        setTimeout(() => {
                    rollouts[i].style.display = 'none'
        }, 1)
    }
    for (let i = 0; i < moreButtons.length; i++) {
        moreButtons[i].innerText = 'MORE'
        moreButtons[i].onclick = () => {
            rollout()
        }
    }
}

for (let i = 0; i < moreButtons.length; i++) {
    moreButtons[i].onclick = () => {
        rollout() 
    }
}