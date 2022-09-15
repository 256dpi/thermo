package main

import (
	"math/rand"
	"time"

	"github.com/256dpi/xo"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/glut"
	"github.com/256dpi/fire/stick"
)

type counterValue struct {
	glut.Base `json:"-" glut:"counter,0"`

	// the counter total
	Total int `json:"total"`

	stick.NoValidation
}

type incrementJob struct {
	axe.Base `json:"-" axe:"increment"`

	// the item to increment
	Item coal.ID `json:"item_id"`
}

func (j *incrementJob) Validate() error {
	// check item
	if j.Item.IsZero() {
		return xo.F("missing item")
	}

	return nil
}

func incrementTask(store *coal.Store) *axe.Task {
	return &axe.Task{
		Job: &incrementJob{},
		Handler: func(ctx *axe.Context) error {
			// get item
			itm := ctx.Job.(*incrementJob).Item

			// increment count
			_, err := store.M(&item{}).Update(ctx, nil, itm, bson.M{
				"$inc": bson.M{
					"Count": 1,
				},
			}, false)
			if err != nil {
				return err
			}

			return nil
		},
	}
}

type periodicJob struct {
	axe.Base `json:"-" axe:"periodic"`
	stick.NoValidation
}

func periodicTask(store *coal.Store) *axe.Task {
	return &axe.Task{
		Job: &periodicJob{},
		Handler: func(ctx *axe.Context) error {
			// increment counter
			var counter counterValue
			err := glut.Mutate(ctx, store, &counter, func(exists bool) error {
				counter.Total++
				return nil
			})
			if err != nil {
				return err
			}

			// wait a bit and update progress
			total := rand.Intn(30)
			for i := 0; i < total; i++ {
				err = ctx.Update("Running...", float64(i)/float64(total))
				if err != nil {
					return err
				}
				time.Sleep(500 * time.Millisecond)
			}

			return nil
		},
		Periodicity: 20 * time.Second,
		PeriodicJob: axe.Blueprint{
			Job: &periodicJob{
				Base: axe.B("periodic"),
			},
		},
	}
}
