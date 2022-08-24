const moreButtons = [...document.getElementsByClassName('more-button')]
const rollouts = document.getElementsByClassName('content-rollout')

const rollout = () => {
    for (let i = 0; i < rollouts.length; i++) {
        rollouts[i].style.transition = 'all 300ms ease-in'
        rollouts[i].style.height = 'fit-content'
    }
    for (let i = 0; i < moreButtons.length; i++) {
        moreButtons[i].innerText = 'LESS'
        moreButtons[i].onclick = () => {
           rollin()}
        }
}


const rollin = () => {
    for (let i = 0; i < rollouts.length; i++) {
        rollouts[i].style.transition = 'all 300ms ease-in'
        rollouts[i].style.height = '0'
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