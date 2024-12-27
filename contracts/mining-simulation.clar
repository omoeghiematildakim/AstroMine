;; Mining Simulation Contract

(define-map asteroids
  { asteroid-id: uint }
  {
    name: (string-ascii 64),
    size: uint,
    resource-richness: uint,
    mining-difficulty: uint
  }
)

(define-map mining-operations
  { operation-id: uint }
  {
    asteroid-id: uint,
    operator: principal,
    start-block: uint,
    end-block: uint,
    resources-extracted: uint
  }
)

(define-data-var asteroid-nonce uint u0)
(define-data-var operation-nonce uint u0)

(define-constant blocks-per-day u144) ;; Assuming 10-minute block times

(define-public (register-asteroid (name (string-ascii 64)) (size uint) (resource-richness uint) (mining-difficulty uint))
  (let
    (
      (new-id (+ (var-get asteroid-nonce) u1))
    )
    (map-set asteroids
      { asteroid-id: new-id }
      {
        name: name,
        size: size,
        resource-richness: resource-richness,
        mining-difficulty: mining-difficulty
      }
    )
    (var-set asteroid-nonce new-id)
    (ok new-id)
  )
)

(define-public (start-mining-operation (asteroid-id uint) (duration-days uint))
  (let
    (
      (new-id (+ (var-get operation-nonce) u1))
      (start-block block-height)
      (end-block (+ block-height (* duration-days blocks-per-day)))
    )
    (asserts! (is-some (map-get? asteroids { asteroid-id: asteroid-id })) (err u404))
    (map-set mining-operations
      { operation-id: new-id }
      {
        asteroid-id: asteroid-id,
        operator: tx-sender,
        start-block: start-block,
        end-block: end-block,
        resources-extracted: u0
      }
    )
    (var-set operation-nonce new-id)
    (ok new-id)
  )
)

(define-public (simulate-mining (operation-id uint))
  (let
    (
      (operation (unwrap! (map-get? mining-operations { operation-id: operation-id }) (err u404)))
      (asteroid (unwrap! (map-get? asteroids { asteroid-id: (get asteroid-id operation) }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get operator operation)) (err u403))
    (asserts! (<= block-height (get end-block operation)) (err u400))
    (let
      (
        (blocks-mined (- block-height (get start-block operation)))
        (extraction-rate (/ (* (get size asteroid) (get resource-richness asteroid)) (get mining-difficulty asteroid)))
        (resources-extracted (* blocks-mined extraction-rate))
      )
      (ok (map-set mining-operations
        { operation-id: operation-id }
        (merge operation { resources-extracted: resources-extracted })))
    )
  )
)

(define-read-only (get-asteroid (asteroid-id uint))
  (map-get? asteroids { asteroid-id: asteroid-id })
)

(define-read-only (get-mining-operation (operation-id uint))
  (map-get? mining-operations { operation-id: operation-id })
)

